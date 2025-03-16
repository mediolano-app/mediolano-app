"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Check, Shield } from "lucide-react"
import { motion } from "framer-motion"

export default function StartCTASection() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Here you would typically send the email to your backend or newsletter service
      setIsSubmitted(true)
      setEmail("")
      // Reset the form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 3000)
    }
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 border border-border p-8 md:p-12 shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">Ready to Tokenize Your Intellectual Property?</h2>
              <p className="text-foreground/80 mb-6">
                Join our newsletter to stay updated on the latest features and be the first to know when we launch new
                services.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className={`flex-grow relative ${isInputFocused ? "ring-2 ring-primary/50 rounded-md" : ""}`}>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-grow pr-10"
                      required
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                    />
                    <motion.div
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40"
                      animate={isInputFocused ? { scale: [1, 1.2, 1] } : {}}
                    >
                      @
                    </motion.div>
                  </div>
                  <Button type="submit" disabled={isSubmitted} className="group touch-feedback">
                    {isSubmitted ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center">
                        <Check className="mr-2 h-4 w-4" />
                        Subscribed
                      </motion.div>
                    ) : (
                      <>
                        Subscribe
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-foreground/60">
                  By subscribing, you agree to our Privacy Policy and Terms of Service.
                </p>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="hidden md:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="relative flex justify-center items-center">
                  <motion.div
                    className="w-64 h-64 border-4 border-primary/20 rounded-full flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <motion.div
                      className="w-48 h-48 border-4 border-secondary/20 rounded-full flex items-center justify-center"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <motion.div
                        className="w-32 h-32 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full flex items-center justify-center shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Shield className="h-12 w-12 text-primary-foreground" />
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  {/* Floating particles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-primary/60"
                      style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`,
                      }}
                      animate={{
                        x: [0, Math.random() * 20 - 10],
                        y: [0, Math.random() * 20 - 10],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

