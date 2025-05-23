"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SkillButton } from "./SkillButton";
import { SkillCard } from "./SkillCard";
import { skills } from "@/lib/skills-data";

export function SkillsSection() {
  const [activeSkill, setActiveSkill] = useState("web");

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-16"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl font-bold text-center mb-12"
      >
        Skills & Expertise
      </motion.h2>

      <div className="flex justify-between mb-8 px-4 max-w-5xl mx-auto">
        {skills.map((skill) => (
          <SkillButton
            key={skill.id}
            icon={skill.icon}
            label={skill.label}
            isActive={activeSkill === skill.id}
            onClick={() => setActiveSkill(skill.id)}
          />
        ))}
      </div>

      <div className="transition-all duration-300 ease-in-out">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSkill}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {skills.find(s => s.id === activeSkill)?.content.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SkillCard
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}