import { EducationSection } from "@/components/education-section";
import { ExperienceSection } from "@/components/experience-section";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { ImageLightboxProvider } from "@/components/image-lightbox";
import { ProjectShowcase } from "@/components/project-showcase";
import { ResumeEditorProvider } from "@/components/resume-editor";
import { SkillsSection } from "@/components/skills-section";
import { VisualEditorToolbar } from "@/components/visual-editor";

export default function Home() {
  return (
    <ResumeEditorProvider>
      <ImageLightboxProvider>
        <Header />
        <main>
          <Hero />
          <EducationSection />
          <ExperienceSection />
          <ProjectShowcase />
          <SkillsSection />
        </main>
        <Footer />
        <VisualEditorToolbar />
      </ImageLightboxProvider>
    </ResumeEditorProvider>
  );
}
