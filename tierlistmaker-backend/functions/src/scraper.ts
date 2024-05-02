import puppeteer from 'puppeteer'

export async function scrapeImages(query: string): Promise<{ src: string, title: string }[] | never> {
    const browser = await puppeteer.launch({
        headless: true, args: [
            '--no-sandbox', '--disable-setuid-sandbox'
        ]
    })
    let images = [] as { src: string, title: string }[]
    try {
        const page = await browser.newPage()
        const url = `https://duckduckgo.com/?q=${query.split(" ").join("+")}&va=b&t=hc&iar=images&iax=images&ia=images&kp=-2`

        // Open the page and wait for the network to be idle
        await page.goto(url, {waitUntil: 'networkidle2'})

        images = await page.evaluate(() => {
            const images = document.querySelectorAll('.tile--img__img')
            return Array.from(images).map((image: any) => {
                const dataSrc = image.getAttribute('data-src')
                const dataSrcUrl = new URL(`https:${dataSrc}`)
                const src = dataSrcUrl.searchParams.get('u') as string
                return {
                    src: src,
                    title: image.alt
                }
            }).filter((image: any) => image.src)
        })
    } catch (error) {
        console.log(error)
    } finally {
        browser.close()
    }


    return images

}