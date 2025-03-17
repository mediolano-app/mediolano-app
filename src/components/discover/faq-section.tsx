"use client"

import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState } from "react"

export default function StartFAQSection() {
  const [openItem, setOpenItem] = useState<string | null>(null)

  const faqs = [
    {
      question: "What is IP tokenization?",
      answer:
        "IP tokenization is the process of creating a digital representation (token) of intellectual property rights on a blockchain. This provides immutable proof of ownership, enables easy transfer of rights, and creates new opportunities for monetization through licensing and royalties.",
    },
    {
      question: "How does Mediolano protect my intellectual property?",
      answer:
        "Mediolano uses blockchain technology to create a verifiable, timestamped record of your intellectual property. This serves as proof of ownership and creation date, and provides automatic protection under the Berne Convention in 181 countries.",
    },
    {
      question: "What types of intellectual property can I tokenize?",
      answer:
        "You can tokenize various forms of intellectual property including artwork, music, videos, literary works, software, AI models, and more. Our platform is designed to accommodate a wide range of creative and innovative works.",
    },
    {
      question: "How much does it cost to tokenize my IP?",
      answer:
        "Tokenization costs vary depending on the type and size of your intellectual property. However, by leveraging Starknet technology, we're able to keep costs significantly lower than traditional IP registration methods. Most tokenizations cost around 0.001 ETH.",
    },
    {
      question: "Can I license my tokenized IP to others?",
      answer:
        "Yes! One of the main benefits of Mediolano is the ability to create programmable licensing terms for your intellectual property. You can set up custom licensing agreements including royalty rates, usage restrictions, and duration terms.",
    },
    {
      question: "Is Mediolano's IP protection legally recognized?",
      answer:
        "Mediolano's tokenization creates verifiable proof of creation and ownership, which can be used as evidence in legal proceedings. While blockchain records aren't yet universally recognized in all jurisdictions, they provide strong evidence under the Berne Convention principles.",
    },
  ]

  const handleAccordionChange = (value: string) => {
    setOpenItem(value === openItem ? null : value)
  }

  return (
    <section id="faq" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Get answers to common questions about intellectual property tokenization and our platform.
            </p>
          </motion.div>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            value={openItem || undefined}
            onValueChange={handleAccordionChange}
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group"
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="border-b border-border data-[state=open]:bg-muted/30 rounded-md my-2 overflow-hidden transition-all duration-200"
                >
                  <AccordionTrigger className="text-left font-medium p-4 hover:no-underline group-hover:text-primary data-[state=open]:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 px-4 pb-4 pt-0">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {faq.answer}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

