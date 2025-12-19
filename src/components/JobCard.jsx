import React from "react";
import TranslateButton from "./TranslateButton";
import { useLanguage } from "../context/LanguageContext";

export default function JobCard({ job }) {
  const { language } = useLanguage ? useLanguage() : { language: "en" };
  const target = language || "en";

  return (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
      <h3 className="text-lg font-semibold">{job.title}</h3>

      <p className="text-sm mt-2 text-gray-300">{job.description}</p>

      {target !== "en" && (
        <div className="mt-3">
          <TranslateButton
            originalText={job.description}
            lang={target}
            cacheKey={`job_${job.id}`}
            children={target === "hi" ? "अनुवाद करें" : target === "mr" ? "अनुवाद करा" : "Translate"}
          />
        </div>
      )}
    </div>
  );
}
