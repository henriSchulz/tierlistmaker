import {Card} from "@/components/ui/card";


export default function () {
    return <Card className="lg:mx-20 mx-5 mt-8 mb-8">

        <div className="p-8">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <h2 className="text-2xl font-bold mb-2">1. What data is collected?</h2>

            <h3 className="text-xl font-bold mt-4 mb-2">1.1 Data you provide to us</h3>
            <p>
                When you sign up on <a href="https://tierlistmaker.org"
                                       className="text-blue-500 hover:underline">Tierlistmaker.org</a> or use our
                services, we collect various types of data from you. This data may include:
            </p>
            <ul className="list-disc ml-6">
                <li><strong>Account information:</strong> This includes your name, email address, username, and profile
                    picture. You provide this information when creating an account.
                </li>
                <li><strong>Profile data:</strong> You may supplement your profile with additional information such as
                    your biography or interests. This information is provided voluntarily by you.
                </li>
                <li><strong>Activity data:</strong> When you use our services, we collect information about your
                    activities, such as the tier lists you create, the ratings you give, and the features you use. This
                    information is collected automatically.
                </li>
                <li><strong>Communication data:</strong> When you contact us, for example, through our support email
                    address, we collect the information you provide, such as your name, email address, and the message
                    you send us.
                </li>
            </ul>

            <h3 className="text-xl font-bold mt-4 mb-2">1.2 Automatically collected data</h3>
            <p>
                When you use our services, we automatically collect certain information about your device and your use
                of our services. This information may include:
            </p>
            <ul className="list-disc ml-6">
                <li><strong>Device information:</strong> This includes your IP address, browser type, and operating
                    system. This information is necessary to provide you with our services and to troubleshoot technical
                    issues.
                </li>
                <li><strong>Usage data:</strong> This includes information about how you use our services, such as the
                    pages you visit, the features you use, and the time you spend on our website. This information is
                    used to improve our services and provide you with personalized content and features.
                </li>
            </ul>

            <h2 className="text-2xl font-bold mb-2 mt-8 ">2. How we use your data</h2>
            <p>
                We use your data for various purposes, such as to:
            </p>
            <ul className="list-disc ml-6">
                <li>
                    <strong>Provide and improve our services:</strong> We use your data to provide you with our
                    services, such as enabling you to create tier lists, give ratings, and engage with our community. We
                    also use your data to improve our services, such as by developing new features and fixing errors.
                </li>
                <li>
                    <strong>Authentication and account management:</strong> We use your data to verify your identity and
                    manage your account.
                </li>
                <li>
                    <strong>Communicate with users:</strong> We use your data to communicate with you, such as providing
                    you with information about our services, new features, and special offers. We also use your data to
                    respond to your inquiries and provide customer service.
                </li>
                <li>
                    <strong>Research and analysis:</strong> We use your data for research and analysis purposes to
                    better understand and improve our services. This research may involve aggregated or de-identified
                    data.
                </li>
                <li>
                    <strong>Advertising:</strong> We may use your data to display personalized advertising to you.
                    However, we will never share your data with third parties for advertising purposes.
                </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-2">3. Analysis partners</h2>
            <p>
                We use analysis partners to help us analyze the usage of our services. These partners may have access to
                your data, but only to the extent necessary for the provision of their services. Our analysis partners
                are obligated to treat your data confidentially and to use it only for the purposes agreed upon with us.
            </p>

            <h3 className="text-xl font-bold mt-4 mb-2">3.1 Google Analytics</h3>
            <p>
                We use Google Analytics, a web analytics service provided by Google, to analyze the usage of our
                website. Google Analytics uses cookies to collect information about your use of our website, such as the
                pages you visit, the features you use, and the time you spend on our website. This information is used
                in aggregated and anonymized form to improve our website and provide you with the best possible
                experience. You can opt out of the use of cookies by Google Analytics by installing the Google Analytics
                Opt-Out Browser Add-on: <a href="https://tools.google.com/dlpage/gaoptout"
                                           className="text-blue-500 hover:underline">https://tools.google.com/dlpage/gaoptout</a>.
            </p>

            <h2 className="text-2xl font-bold mb-2 mt-8">4. Security</h2>
            <p>
                We take the protection of your data very seriously and implement appropriate measures to protect your data from unauthorized access, use, disclosure, alteration, or destruction. These measures include:
            </p>
            <ul className="list-disc ml-6">
                <li><strong>Technical measures:</strong> We use encryption technologies to protect your data both during transmission and at rest. We also use firewalls and other security technologies to protect our systems from unauthorized access.</li>
                <li><strong>Organizational measures:</strong> We have internal policies and procedures in place to protect your data.</li>
            </ul>

            <h3 className="text-xl font-bold mt-8 mb-2">4.2 Encryption</h3>
            <p>
                We use encryption technologies to protect your data both during transmission and at rest. This means that your data is protected even when transmitted over the internet or stored on our servers.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-2">5. Storage and Deletion of Data</h2>

            <h3 className="text-xl font-bold mt-4 mb-2">5.1 Storage</h3>
            <p>
                We store your data for as long as necessary for the purposes mentioned in this Privacy Policy or as required by law. For example, we store your data for as long as you have your Tierlistmaker.org account. If you delete your account, we will delete your data.
            </p>

            <h3 className="text-xl font-bold mt-4 mb-2">5.2 Deletion</h3>
            <p>
                You can delete your Tierlistmaker.org account and have your data deleted at any time. To delete your account, please send an email to <a href="mailto:contact@tierlistmaker.org" className="text-blue-500 hover:underline">contact@tierlistmaker.org</a>.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-2">6. Your Rights</h2>
            <p>
                You have the following rights regarding your data:
            </p>
            <ul className="list-disc ml-6">
                <li><strong>Access to your data:</strong> You have the right to access the data we have collected about you.</li>
                <li><strong>Rectification of your data:</strong> You have the right to correct your data if it is inaccurate or incomplete.</li>
                <li><strong>Deletion of your data:</strong> You have the right to have your data deleted if the conditions for deletion are met under applicable data protection laws.</li>
                <li><strong>Restriction of processing your data:</strong> You have the right to restrict the processing of your data if the conditions for restriction are met under applicable data protection laws.</li>
                <li><strong>Objection to processing your data:</strong> You have the right to object to the processing of your data if the conditions for objection are met under applicable data protection laws.</li>
                <li><strong>Data portability:</strong> You have the right to receive your data in a structured, commonly used, and machine-readable format and to transmit this data to another controller.</li>
            </ul>
            <p>
                To exercise your rights, please send an email to <a href="mailto:contact@tierlistmaker.org" className="text-blue-500 hover:underline">contact@tierlistmaker.org</a>.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-2">7. Contact</h2>
            <p>
                If you have any questions about this Privacy Policy or wish to exercise your rights regarding your data, please contact us at: <a href="mailto:contact@tierlistmaker.org" className="text-blue-500 hover:underline">contact@tierlistmaker.org</a>.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-2">8. Changes to the Privacy Policy</h2>
            <p>
                We may change this Privacy Policy from time to time. If we make changes, we will notify you by posting the updated Privacy Policy on our website. The updated Privacy Policy will take effect immediately upon posting.
            </p>

        </div>


    </Card>
}





