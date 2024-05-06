import {Card} from "@/components/ui/card";
import {Helmet} from "react-helmet";

export default function () {

    return <Card className="lg:mx-20 mx-5 mt-8 mb-8">

        <Helmet>
            <title>
                Terms of Service - Tierlistmaker
            </title>
        </Helmet>

        <div className="p-8">

            <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>

            <h2 className="text-2xl font-bold mb-2 mt-8">Agreement to Terms</h2>
            <p>
                Welcome to TierListMaker.org! These terms of service govern your use of TierListMaker.org and any
                related services provided by us. By accessing or using our website, you agree to be bound by these terms
                of service. If you do not agree to these terms of service, please refrain from using our website.
            </p>

            <h2 className="text-2xl font-bold mb-2 mt-8">Intellectual Property Rights</h2>

            <p>
                The content on TierListMaker.org, including without limitation, the text, graphics, photos, music,
                videos, and interactive features ("Content") and the trademarks, service marks, and logos contained
                therein ("Marks"), are owned by or licensed to TierListMaker.org, subject to copyright and other
                intellectual property rights under the law. You may not use, copy, reproduce, modify, distribute,
                transmit, or exploit any of the content for commercial purposes without our prior written consent.
            </p>

            <h2 className="text-2xl font-bold mb-2 mt-8">User Representations</h2>

            <p>
                By using TierListMaker.org, you represent and warrant that:
            </p>
            <ul className="list-disc ml-6">
                <li>You have the legal capacity and you agree to comply with these terms of service.</li>
                <li>You will not use TierListMaker.org for any illegal or unauthorized purpose.</li>
                <li>Your use of TierListMaker.org will not violate any applicable law or regulation.</li>
            </ul>

            <h2 className="text-2xl font-bold mb-2 mt-8">Prohibited Activities</h2>

            <p>
                You may not access or use TierListMaker.org for any purpose other than that for which we make the site
                available. Prohibited activities include, but are not limited to:
            </p>

            <ul className="list-disc ml-6">
                <li>Using TierListMaker.org in any manner that could interfere with, disrupt, negatively affect, or
                    inhibit other users from fully enjoying TierListMaker.org.
                </li>
                <li>Engaging in any automated use of the system, such as using scripts to send comments or messages.
                </li>
                <li>Attempting to bypass any measures of TierListMaker.org designed to prevent or restrict access to the
                    site.
                </li>
                <li>Attempting to impersonate another user or person or using the username of another user.</li>
                <li>Posting or transmitting any content that is unlawful, threatening, abusive, defamatory, obscene,
                    vulgar, or otherwise offensive.
                </li>
            </ul>

            <h2 className="text-2xl font-bold mb-2 mt-8">Advertisers</h2>

            <p>
                TierListMaker.org may contain advertisements from third parties that are not owned or controlled by
                TierListMaker.org. We do not endorse or assume any responsibility for any such third-party sites,
                information, materials, products, or services. If you access a third-party website or service from
                TierListMaker.org, you do so at your own risk, and you understand that these terms of service and our
                privacy policy do not apply to your use of such sites. You expressly relieve TierListMaker.org from any
                and all liability arising from your use of any third-party website, service, or content.
            </p>

            <h2 className="text-2xl font-bold mb-2 mt-8">Privacy Policy</h2>

            <p>
                Your privacy is important to us. It is TierListMaker.org's policy to respect your privacy regarding any
                information we may collect while operating our website. Please review our privacy policy to understand
                our practices.
            </p>

            <h2 className="text-2xl font-bold mb-2 mt-8">Copyright Infringements</h2>

            <p>
                We respect the intellectual property rights of others. If you believe that any material available on or
                through TierListMaker.org infringes upon any copyright you own or control, please promptly notify us
                using the contact information provided below. We will respond to notices of alleged infringement that
                comply with applicable law and are properly provided to us.
            </p>


        </div>


    </Card>

}