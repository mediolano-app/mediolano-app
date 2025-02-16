import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is Mediolano?",
    answer:
      "Mediolano is a platform that provides seamless tokenization for Intellectual Property, leveraging Starknet's technology for digital assets. It offers a comprehensive solution for creators, collectors, and organizations to protect and monetize their IP assets.",
  },
  {
    question: "How does Mediolano protect my IP?",
    answer:
      "Mediolano automatically tokenizes and protects your IP in 181 countries, according to The Berne Convention for the Protection of Literary and Artistic Works. This creates an immutable record of your IP on the blockchain, providing proof of ownership and timestamp.",
  },
  {
    question: "What types of IP can I register?",
    answer:
      "You can register various types of IP assets, including artwork, video, music, literature, AI models, software, and other works of authorship. Mediolano supports a wide range of digital and creative assets.",
  },
  {
    question: "How long is my copyright valid?",
    answer:
      "Copyright validity ranges from 50 to 70 years, depending on the legal jurisdiction. Mediolano ensures your IP is protected for the maximum duration allowed by law in each country.",
  },
  {
    question: "Can I license my IP through Mediolano?",
    answer:
      "Yes, Mediolano provides services for licensing Programmable IP with countless combinations and total sovereignty. You can create custom licensing terms and automate royalty payments using smart contracts.",
  },
  {
    question: "What is Programmable IP?",
    answer:
      "Programmable IP refers to intellectual property assets that are tokenized and managed through smart contracts on the blockchain. This allows for automated licensing, royalty distribution, and other programmable features that enhance the management and monetization of your IP.",
  },
  {
    question: "How does Mediolano use Starknet?",
    answer:
      "Mediolano leverages Starknet's high-speed, low-cost, and smart contract capabilities to provide efficient and secure tokenization of IP assets. This enables fast transactions, reduced fees, and advanced programmability for IP management.",
  },
  {
    question: "Is Mediolano open-source?",
    answer:
      "Yes, parts of Mediolano's technology are open-source. You can find our public repositories on our GitHub page. We believe in transparency and community collaboration to advance the field of IP protection and management.",
  },
]

export default function FAQ() {
  return (
    <section className="space-y-6">
       <h2 className="text-4xl text-center tracking-tighter sm:text-5xl md:text-6xl">FAQ</h2>
      <Accordion type="single" collapsible className="w-full bg-background/40 p-8 rounded-lg">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

