import React, { useState } from "react";
import { AttributesControls, CSSControls, PositionControls, ResponsiveControls } from "../shared/StyleControls";

interface ContainerAdvancedSettingsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions: any;
}

export const ContainerAdvancedSettings: React.FC<ContainerAdvancedSettingsProps> = ({ props, actions }) => {
  const [openAccordion, setOpenAccordion] = useState<string>("css");

  const toggleAccordion = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? "" : id));
  };

  return (
    <div className="space-y-4">
      <Accordion id="css" title="CSS" isOpen={openAccordion === "css"} onToggle={toggleAccordion}>
        <CSSControls props={props} actions={actions} />
      </Accordion>

      <Accordion id="attributes" title="Attributes" isOpen={openAccordion === "attributes"} onToggle={toggleAccordion}>
        <AttributesControls props={props} actions={actions} />
      </Accordion>

      <Accordion id="responsive" title="Responsive" isOpen={openAccordion === "responsive"} onToggle={toggleAccordion}>
        <ResponsiveControls props={props} actions={actions} />
      </Accordion>

      <Accordion id="position" title="Position" isOpen={openAccordion === "position"} onToggle={toggleAccordion}>
        <PositionControls props={props} actions={actions} />
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
    {isOpen && <div className="p-4 border-t border-gray-200 space-y-3">{children}</div>}
  </div>
);


