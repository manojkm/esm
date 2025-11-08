import React, { useState } from "react";
import { BackgroundControls, BorderControls, BoxShadowControls, ColorControls, SpacingControls } from "../shared/StyleControls";

interface ContainerStyleSettingsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions: any;
}

export const ContainerStyleSettings: React.FC<ContainerStyleSettingsProps> = ({ props, actions }) => {
  const [openAccordion, setOpenAccordion] = useState<string>("spacing");

  const toggleAccordion = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? "" : id));
  };

  return (
    <div className="space-y-4">
      <Accordion id="spacing" title="Spacing" isOpen={openAccordion === "spacing"} onToggle={toggleAccordion}>
        <SpacingControls props={props} actions={actions} />
      </Accordion>

      <Accordion id="background" title="Background" isOpen={openAccordion === "background"} onToggle={toggleAccordion}>
        <BackgroundControls props={props} actions={actions} />
      </Accordion>

      <Accordion id="border" title="Border" isOpen={openAccordion === "border"} onToggle={toggleAccordion}>
        <BorderControls props={props} actions={actions} />
      </Accordion>

      <Accordion id="boxShadow" title="Box Shadow" isOpen={openAccordion === "boxShadow"} onToggle={toggleAccordion}>
        <BoxShadowControls props={props} actions={actions} />
      </Accordion>

      <Accordion id="color" title="Color" isOpen={openAccordion === "color"} onToggle={toggleAccordion}>
        <ColorControls props={props} actions={actions} />
      </Accordion>
    </div>
  );
};

interface AccordionProps {
  id: string;
  title: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ id, title, isOpen, onToggle, children }) => (
  <div className="border border-gray-200 rounded-md">
    <button onClick={() => onToggle(id)} className="w-full flex items-center justify-between p-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
      {title}
      <span className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
    </button>
    {isOpen && <div className="p-4 border-t border-gray-200">{children}</div>}
  </div>
);


