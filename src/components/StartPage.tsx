import { CallToAction } from "./widgets/CallToAction";
import { DashboardPreview } from "./widgets/DashboardPreview";
import { FeaturedNFTs } from "./widgets/FeaturedAssets";
import { HeroStart } from "./widgets/HeroStart";
import { HowItWorks } from "./widgets/HowItWorks";
import { LicensingProgrammableIP } from "./widgets/LicensingProgrammableIP";
import { ProgrammableIPSection } from "./widgets/ProgrammableIP";
import { SocialFeaturesSection } from "./widgets/SocialFeatures";
import { UserCollectionsSection } from "./widgets/UsersCollections";




export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroStart />
      
      <HowItWorks />
      
      <ProgrammableIPSection />

      <LicensingProgrammableIP />

      <DashboardPreview />
      
      <UserCollectionsSection />

      

      <CallToAction />
    </div>
  )
}

