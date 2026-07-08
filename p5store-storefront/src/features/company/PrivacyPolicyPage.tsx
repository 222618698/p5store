import Header from '@/components/Header';
import Footer from '@/components/Footer';

type Block =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'dl'; items: [string, string][] };

interface Section {
  title: string;
  blocks: Block[];
}

const p = (text: string): Block => ({ type: 'p', text });
const ul = (items: string[]): Block => ({ type: 'ul', items });

const SECTIONS: Section[] = [
  {
    title: '1. Definitions and Interpretation',
    blocks: [
      p('In this Policy, the following terms shall have the following meanings:'),
      {
        type: 'dl',
        items: [
          ['Account', 'means an account required to access and/or use certain areas and features of Our Site;'],
          [
            'Cookie',
            'means a small text file placed on your computer or device by Our Site when you visit certain parts of Our Site and/or when you use certain features of Our Site. Details of the Cookies used by Our Site are set out in section 12, below;',
          ],
          ['Cookie Law', 'means the relevant parts of the Privacy and Electronic Communications (EC Directive) Regulations 2003;'],
          [
            'personal data',
            'means any and all data that relates to an identifiable person who can be directly or indirectly identified from that data. In this case, it means personal data that you give to Us via Our Site. This definition shall, where applicable, incorporate the definitions provided in the EU Regulation 2016/679 – the General Data Protection Regulation ("GDPR");',
          ],
          ['We/Us/Our', 'means https://p5store.com, whose registered address is: ;'],
          ['Our Site', 'means https://p5store.com; and'],
          ['Contact Details', 'means via any of the methods listed on our Contact Us page, or at our registered address above.'],
        ],
      },
    ],
  },
  {
    title: '2. What Does This Policy Cover?',
    blocks: [
      p(
        'This Privacy Policy applies only to your use of Our Site. Our Site may contain links to other websites. Please note that We have no control over how your data is collected, stored, or used by other websites and We advise you to check the privacy policies of any such websites before providing any data to them.'
      ),
    ],
  },
  {
    title: '3. Your Rights',
    blocks: [
      p('As a data subject, you have the following rights under the GDPR, which this Policy and Our use of personal data have been designed to uphold:'),
      ul([
        'The right to be informed about Our collection and use of personal data;',
        'The right of access to the personal data We hold about you (see section 11);',
        'The right to rectification if any personal data We hold about you is inaccurate or incomplete (please contact Us using the details in section 13);',
        'The right to be forgotten – i.e. the right to ask Us to delete any personal data We hold about you (We only hold your personal data for a limited time, as explained in section 6 but if you would like Us to delete it sooner, please contact Us using the details in section 13);',
        'The right to restrict (i.e. prevent) the processing of your personal data;',
        'The right to data portability (obtaining a copy of your personal data to re-use with another service or organisation);',
        'The right to object to Us using your personal data for particular purposes; and',
        'Rights with respect to automated decision making and profiling.',
      ]),
      p(
        'If you have any cause for complaint about Our use of your personal data, please contact Us using the details provided in section 13 and We will do Our best to solve the problem for you. If We are unable to help, you also have the right to lodge a complaint with the UK’s supervisory authority, the Information Commissioner’s Office.'
      ),
      p('For further information about your rights, please contact the Information Commissioner’s Office or your local Citizens Advice Bureau.'),
    ],
  },
  {
    title: '4. What Data Do We Collect?',
    blocks: [
      p('Depending upon your use of Our Site, We may collect some or all of the following personal, and non-personal data (please also see section 12 on Our use of Cookies and similar technologies):'),
      ul([
        'name;',
        'date of birth;',
        'gender;',
        'business/company name;',
        'contact information such as email addresses, telephone numbers, and delivery address;',
        'demographic information such as post code, preferences, and interests;',
        'IP address;',
        'web browser type and version;',
        'operating system;',
        'a list of URLs starting with a referring site, your activity on Our Site, and the site you exit to.',
      ]),
    ],
  },
  {
    title: '5. How Do We Use Your Data?',
    blocks: [
      p('All personal data is processed and stored securely, for no longer than is necessary in light of the reason(s) for which it was first collected. We will comply with Our obligations and safeguard your rights under the GDPR at all times. For more details on security see section 6, below.'),
      p('Our use of your personal data will always have a lawful basis, either because it is necessary for Our performance of a contract with you, because you have consented to Our use of your personal data (e.g. by subscribing to emails), or because it is in Our legitimate interests. Specifically, We may use your data for the following purposes:'),
      ul([
        'Providing and managing your Account;',
        'Providing and managing your access to Our Site;',
        'Personalising and tailoring your experience on Our Site;',
        'Supplying Our products/services to you (please note that We require your personal data in order to enter into a contract with you);',
        'Personalising and tailoring Our products/services for you;',
        'Replying to emails from you;',
        'Supplying you with emails that you have opted into (you may unsubscribe or opt-out at any time by clicking the link in our emails);',
        'Market research;',
        'Analysing your use of Our Site and gathering feedback to enable Us to continually improve Our Site and your user experience.',
      ]),
      p('With your permission and/or where permitted by law, We may also use your data for marketing purposes which may include contacting you by email/telephone/text message/post with information, news and offers on Our products/services. We will not, however, send you any unsolicited marketing or spam and will take all reasonable steps to ensure that We fully protect your rights and comply with Our obligations under the GDPR and the Privacy and Electronic Communications (EC Directive) Regulations 2003.'),
      p('Third parties (such as Google, YouTube, Facebook) whose content appears on Our Site may use third party Cookies, as detailed below in section 12. Please refer to section 12 for more information on controlling Cookies. Please note that We do not control the activities of such third parties, nor the data they collect and use and advise you to check the privacy policies of any such third parties.'),
      p('You have the right to withdraw your consent to Us using your personal data at any time, and to request that We delete it.'),
      p('We do not keep your personal data for any longer than is necessary in light of the reason(s) for which it was first collected.'),
    ],
  },
  {
    title: '6. How and Where Do We Store Your Data?',
    blocks: [
      p('We only keep your personal data for as long as We need to in order to use it as described above in section 6, and/or for as long as We have your permission to keep it.'),
      p('Some or all of your data may be stored outside of the European Economic Area (“the EEA”) (The EEA consists of all EU member states, plus Norway, Iceland, and Liechtenstein). You are deemed to accept and agree to this by using Our Site and submitting information to Us. If We do store data outside the EEA, We will take all reasonable steps to ensure that your data is treated as safely and securely as it would be within the UK and under GDPR by checking suppliers are Privacy Shield and/or ISO27001 compliant.'),
      p('Data security is very important to Us, and to protect your data We have taken suitable measures to safeguard and secure data collected through Our Site by using checking suppliers are Privacy Shield and/or ISO27001 compliant and by using Secure SSL connections.'),
    ],
  },
  {
    title: '7. Do We Share Your Data?',
    blocks: [
      p('Subject to section 7, We will not share any of your data with any third parties for any purposes.'),
      p('In certain circumstances, We may be legally required to share certain data held by Us, which may include your personal data, for example, where We are involved in legal proceedings, where We are complying with legal obligations, a court order, or a governmental authority.'),
      p('We may sometimes contract with third parties to supply products and services to you on Our behalf. These may include payment processing, delivery of goods, search engine facilities, advertising, and marketing. In some cases, the third parties may require access to some or all of your data. Where any of your data is required for such a purpose, We will take all reasonable steps to ensure that your data will be handled safely, securely, and in accordance with your rights, Our obligations, and the obligations of the third party under the law.'),
      p('We may compile statistics about the use of Our Site including data on traffic, usage patterns, user numbers, sales, and other information. All such data will be anonymised and will not include any personally identifying data, or any anonymised data that can be combined with other data and used to identify you. We may from time to time share such data with third parties such as prospective investors, affiliates, partners, and advertisers. Data will only be shared and used within the bounds of the law.'),
      p('We may sometimes use third party data processors that are located outside of the European Economic Area (“the EEA”) (The EEA consists of all EU member states, plus Norway, Iceland, and Liechtenstein). Where We transfer any personal data outside the EEA, We will take all reasonable steps to ensure that your data is treated as safely and securely as it would be within the UK and under the GDPR by checking suppliers are Privacy Shield and/or ISO27001 compliant.'),
      p('In certain circumstances, We may be legally required to share certain data held by Us, which may include your personal data, for example, where We are involved in legal proceedings, where We are complying with legal requirements, a court order, or a governmental authority.'),
    ],
  },
  {
    title: '8. What Happens If Our Business Changes Hands?',
    blocks: [
      p('We may, from time to time, expand or reduce Our business and this may involve the sale and/or the transfer of control of all or part of Our business. Any personal data that you have provided will, where it is relevant to any part of Our business that is being transferred, be transferred along with that part and the new owner or newly controlling party will, under the terms of this Privacy Policy, be permitted to use that data only for the same purposes for which it was originally collected by Us.'),
      p('In the event that any of your data is to be transferred in such a manner, you will not be contacted in advance and informed of the changes.'),
    ],
  },
  {
    title: '9. How Can You Control Your Data?',
    blocks: [
      p('In addition to your rights under the GDPR, set out in section 3, you submit personal data via Our Site, you may be given options to restrict Our use of your data. In particular, We aim to give you strong controls on Our use of your data for direct marketing purposes (including the ability to opt-out of receiving emails from Us which you may do by unsubscribing using the links provided in Our emails and at the point of providing your details and by managing your Account).'),
    ],
  },
  {
    title: '10. Your Right to Withhold Information',
    blocks: [
      p('You may access certain areas of Our Site without providing any data at all. However, to use all features and functions available on Our Site you may be required to submit or allow for the collection of certain data.'),
      p('You may restrict Our use of Cookies. For more information, see section 13.'),
    ],
  },
  {
    title: '11. How Can You Access Your Data?',
    blocks: [
      p('You have the right to ask for a copy of any of your personal data held by Us (where such data is held). Under the GDPR, no fee is payable and We will provide any and all information in response to your request free of charge. Please contact Us for more details using the Contact Details above.'),
    ],
  },
  {
    title: '12. Our Use of Cookies',
    blocks: [
      p('Our Site may place and access certain first party Cookies on your computer or device. First party Cookies are those placed directly by Us and are used only by Us. We use Cookies to facilitate and improve your experience of Our Site and to provide and improve Our products/services. We have carefully chosen these Cookies and have taken steps to ensure that your privacy and personal data is protected and respected at all times.'),
      p('By using Our Site you may also receive certain third party Cookies on your computer or device. Third party Cookies are those placed by websites, services, and/or parties other than Us. Third party Cookies are used on Our Site for advertising purposes and providing marketing analytical information. For more details, please refer to section 5, above, and to section 12 below. These Cookies are not integral to the functioning of Our Site and your use and experience of Our Site will not be impaired by refusing consent to them.'),
      p('All Cookies used by and on Our Site are used in accordance with current Cookie Law.'),
      p('Before third party Cookies that use your personal data are placed on your computer or device, you will be shown a popup requesting your consent to set those Cookies. By giving your consent to the placing of Cookies you are enabling Us to provide the best possible experience and service to you. You may, if you wish, deny consent to the placing of Cookies; however certain features of Our Site may not function fully or as intended. You will be given the opportunity to allow only first party Cookies and block third party Cookies which use your personal data.'),
      p('Certain features of Our Site depend on Cookies to function. Cookie Law deems these Cookies to be “strictly necessary”. These Cookies are shown below in section 12. Your consent will not be sought to place these Cookies, but it is still important that you are aware of them. You may still block these Cookies by changing your internet browser’s settings as detailed below in section 12, but please be aware that Our Site may not work properly if you do so. We have taken great care to ensure that your privacy is not at risk by allowing them.'),
      p('The following first party Cookies may be placed on your computer or device:'),
      ul([
        'Cookies to assist with the functionality of the website, such as whether you’ve logged into the website, your preferences, and the current contents of your basket;',
      ]),
      p('and the following third party Cookies may be placed on your computer or device:'),
      ul(['Google Analytics – Anonymous Data Collection;', 'Facebook Pixel;', 'Google Conversion/Remarketing.']),
      p('Our Site uses analytics services provided by Google Analytics. Website analytics refers to a set of tools used to collect and analyse anonymous usage information, enabling Us to better understand how Our Site is used. This, in turn, enables Us to improve Our Site and the products/services offered through it. You do not have to allow Us to use these Cookies, however whilst Our use of them does not pose any risk to your privacy or your safe use of Our Site, it does enable Us to continually improve Our Site, making it a better and more useful experience for you.'),
      p('In addition to the controls that We provide, you can choose to enable or disable Cookies in your internet browser. Most internet browsers also enable you to choose whether you wish to disable all cookies or only third party Cookies. By default, most internet browsers accept Cookies but this can be changed. For further details, please consult the help menu in your internet browser or the documentation that came with your device.'),
      p('You can choose to delete Cookies on your computer or device at any time, however you may lose any information that enables you to access Our Site more quickly and efficiently including, but not limited to, login and personalisation settings.'),
      p('It is recommended that you keep your internet browser and operating system up-to-date and that you consult the help and guidance provided by the developer of your internet browser and manufacturer of your computer or device if you are unsure about adjusting your privacy settings.'),
    ],
  },
  {
    title: '13. Contacting Us',
    blocks: [
      p('If you have any questions about Our Site or this Privacy Policy, please contact Us for more details using the Contact Details above. Please ensure that your query is clear, particularly if it is a request for information about the data We hold about you (as under section 12, above).'),
    ],
  },
  {
    title: '14. Changes to Our Privacy Policy',
    blocks: [
      p('We may change this Privacy Policy from time to time (for example, if the law changes). Any changes will be immediately posted on Our Site and you will be deemed to have accepted the terms of the Privacy Policy on your first use of Our Site following the alterations. We recommend that you check this page regularly to keep up-to-date.'),
    ],
  },
];

function BlockView({ block }: { block: Block }) {
  if (block.type === 'p') {
    return <p className="text-sm leading-relaxed text-navy-700/80">{block.text}</p>;
  }
  if (block.type === 'ul') {
    return (
      <ul className="space-y-1.5">
        {block.items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-relaxed text-navy-700/80">
            <span className="text-gold-600">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <dl className="space-y-2">
      {block.items.map(([term, def]) => (
        <div key={term} className="text-sm leading-relaxed text-navy-700/80">
          <dt className="inline font-semibold text-navy-900">"{term}"</dt>{' '}
          <dd className="inline">{def}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="font-display text-3xl text-navy-900">Privacy Policy</h1>

        <p className="mt-4 text-sm leading-relaxed text-navy-700/80">
          We understand that your privacy is important to you and that you care about how
          your personal data is used and shared online. We respect and value the privacy of
          everyone who visits this website, Our Site and will only collect and use personal
          data in ways that are described here, and in a manner that is consistent with Our
          obligations and your rights under the law.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-navy-700/80">
          Please read this Privacy Policy carefully and ensure that you understand it. Your
          acceptance of Our Privacy Policy is deemed to occur upon your first use of Our
          Site. If you do not accept and agree with this Privacy Policy, you must stop using
          Our Site immediately.
        </p>

        <div className="mt-10 space-y-10">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 font-display text-lg text-navy-900">{section.title}</h2>
              <div className="space-y-3">
                {section.blocks.map((block, i) => (
                  <BlockView key={i} block={block} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
