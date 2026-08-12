export function generateBuilderTitle(stack: string): string {
  const s = stack.toLowerCase();
  
  if (s.includes("backend") || s.includes("infra") || s.includes("devops") || s.includes("rust") || s.includes("go") || s.includes("systems")) {
    const titles = ["Infra Architect", "Systems Alchemist", "Backend Artisan", "Core Engineer"];
    return titles[s.length % titles.length];
  }
  
  if (s.includes("frontend") || s.includes("ui") || s.includes("design") || s.includes("react") || s.includes("next") || s.includes("css")) {
    const titles = ["Pixel Sorcerer", "Interface Artisan", "Frontend Alchemist", "UI Architect"];
    return titles[s.length % titles.length];
  }
  
  if (s.includes("ai") || s.includes("ml") || s.includes("data") || s.includes("python") || s.includes("llm")) {
    const titles = ["Model Whisperer", "Neural Cartographer", "Data Alchemist", "Intelligence Architect"];
    return titles[s.length % titles.length];
  }
  
  if (s.includes("full") || s.includes("stack") || s.includes("web") || s.includes("app")) {
    const titles = ["Full-Stack Nomad", "Systems Integrator", "Digital Craftsman", "Product Builder"];
    return titles[s.length % titles.length];
  }
  
  if (s.trim() === "") {
    return "Builder";
  }

  // Fallback
  const fallbacks = ["Chaos Engineer", "Code Alchemist", "Digital Nomad", "Visionary Builder"];
  return fallbacks[s.length % fallbacks.length];
}
