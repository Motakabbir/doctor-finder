import Link from 'next/link';

export default function FAQPage() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Frequently Asked Questions</h1>
          <p className="mt-4 text-lg text-gray-500">
            Find answers to common questions about Doctor Finder services.
          </p>
        </div>

        <div className="mt-12">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12">
            {faqs.map((faq) => (
              <div key={faq.question} className="border-b border-gray-200 pb-4">
                <dt className="text-lg font-medium text-gray-900">{faq.question}</dt>
                <dd className="mt-2 text-base text-gray-500">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-16 text-center">
          <p className="text-base text-gray-500">
            Can't find the answer you're looking for? Contact our{' '}
            <Link href="/contact" className="font-medium text-blue-600 hover:text-blue-500">
              customer support team
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

const faqs = [
  {
    question: 'How do I book an appointment with a doctor?',
    answer: 'You can book an appointment by searching for a doctor, selecting their profile, and clicking the "Book Appointment" button. Follow the prompts to select a date and time that works for you.'
  },
  {
    question: 'Can I cancel or reschedule my appointment?',
    answer: 'Yes, you can cancel or reschedule your appointment up to 24 hours before the scheduled time without any penalty. Simply log in to your account and go to "My Appointments" to make changes.'
  },
  {
    question: 'Are all doctors on the platform verified?',
    answer: 'Yes, all healthcare professionals on Doctor Finder go through a thorough verification process. We check their credentials, licenses, and practice history to ensure they are qualified to provide care.'
  },
  {
    question: 'How do I leave a review for a doctor?',
    answer: 'After your appointment, you will receive an email invitation to leave a review. Alternatively, you can visit the doctor\'s profile page and click on the "Write a Review" button.'
  },
  {
    question: 'Is my personal and medical information secure?',
    answer: 'Yes, we take data security very seriously. All personal and medical information is encrypted and stored securely in compliance with healthcare privacy regulations.'
  },
  {
    question: 'What specialties do you cover?',
    answer: 'Doctor Finder covers a wide range of medical specialties including but not limited to General Practice, Cardiology, Dermatology, Orthopedics, Pediatrics, Psychiatry, and many more.'
  },
  {
    question: 'How can I pay for my appointment?',
    answer: 'We accept various payment methods including credit/debit cards and digital payment services. Payment is typically collected at the time of booking.'
  },
  {
    question: 'What if I need to see a doctor urgently?',
    answer: 'For urgent medical needs, please visit the nearest emergency room or call emergency services. Doctor Finder is not designed for emergency medical situations.'
  },
];