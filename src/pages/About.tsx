import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { SiteSettings } from '../types';
import { CheckCircle2, Users, Award, Briefcase } from 'lucide-react';

export function About() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .maybeSingle();
      if (data) setSettings(data);
    };
    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Everest</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Leaders in high-quality hydraulic and pneumatic solutions since 2020.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Who We Are</h2>
              <div className="prose prose-lg text-gray-700 space-y-4">
                <p>
                  Established in the year <strong>2020</strong> at Pune (Maharashtra, India), <strong>Everest Hydro Pneumatic Solutions</strong> is a leading manufacturer and trader of a wide range of Automobile & Laboratory Products. Our portfolio includes Oil Free Air Compressors, Reciprocating Lubricated Compressors, Screw Compressors, and Material Handling Equipment.
                </p>
                <p>
                  Our offered products are highly admired in the market due to their strength, sturdiness, and precision engineering. We source our materials from honest vendors and manufacture in compliance with defined industry standards to ensure durability and high performance.
                </p>
                <p>
                  We offer these products in various technical specifications to meet the specific requirements of our clients, ensuring complete satisfaction.
                </p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-xl p-8 border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold mb-4 text-blue-900">Why Choose Us?</h3>
              <ul className="space-y-4">
                {[
                  'Durable finish standards',
                  'High strength & robust construction',
                  'Precision engineering',
                  'Ability to withstand high pressure',
                  'Timely delivery of bulk orders',
                  'Competitive pricing'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Quality & Team */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Quality Policy */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Award className="text-orange-500" size={32} />
                <h2 className="text-3xl font-bold text-gray-900">Quality Assurance</h2>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                In order to design and fabricate our products, our vendors use high-quality basic materials and advanced technology. Offered products are widely treasured by our clients for features like durable finish standards, high strength, and robust construction.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our experts struggle hard to distinguish miscellaneous requirements of our clients and offer the final product as per the same. We are fostered with a wide vendor base that includes genuine and trustworthy vendors of the industry.
              </p>
            </div>

            {/* Team */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Users className="text-blue-600" size={32} />
                <h2 className="text-3xl font-bold text-gray-900">Our Team</h2>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Backed with a team of capable professionals, we have been proficient to present the finest quality products to our clients as per their explicit necessities within the committed time frame. We have chosen our professionals after all-inclusive study of their knowledge in the individual domains.
              </p>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Management</h4>
                <p className="text-gray-700">
                  We are managed under the mentorship of <strong>Mr. Vishal Thube</strong>. His immense market understanding and in-depth industrial experience make us able to meet specific requirements of clients in an efficient manner.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Factsheet */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <Briefcase className="text-blue-900" size={32} />
            <h2 className="text-3xl font-bold text-center text-gray-900">Company Factsheet</h2>
          </div>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              {/* Basic Information */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-4 border-b pb-2">Basic Information</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-gray-500">Nature of Business</dt>
                    <dd className="font-medium text-gray-900">Service Provider and Others</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Additional Business</dt>
                    <dd className="font-medium text-gray-900">Wholesale Business</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Company CEO</dt>
                    <dd className="font-medium text-gray-900">Rahul Nanasaheb Thube</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Total Employees</dt>
                    <dd className="font-medium text-gray-900">11 to 25 People</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Legal Status</dt>
                    <dd className="font-medium text-gray-900">Proprietorship</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Annual Turnover</dt>
                    <dd className="font-medium text-gray-900">0 - 40 L</dd>
                  </div>
                </dl>
              </div>

              {/* Statutory Profile */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-4 border-b pb-2">Statutory Profile</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-gray-500">GST Registration Date</dt>
                    <dd className="font-medium text-gray-900">01-09-2020</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">GST Partner Name</dt>
                    <dd className="font-medium text-gray-900">Rahul Nanasaheb Thube</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">GST No.</dt>
                    <dd className="font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded inline-block">
                      {settings?.gst_number || '27ATEPT3692E1ZD'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
