import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AgreementTermsProps {
  terms: Terms
}

interface Terms {
  duration: string;
  territory: string;
  rights: string;
  royalties: string;
  termination?: string;
}

export function AgreementTerms({ terms }: AgreementTermsProps) {
  const getDurationText = (duration: string) => {
    switch (duration) {
      case "1_year":
        return "1 Year"
      case "2_years":
        return "2 Years"
      case "3_years":
        return "3 Years"
      case "5_years":
        return "5 Years"
      case "10_years":
        return "10 Years"
      case "perpetual":
        return "Perpetual"
      case "custom":
        return "Custom"
      default:
        return duration
    }
  }

  const getTerritoryText = (territory: string) => {
    switch (territory) {
      case "worldwide":
        return "Worldwide"
      case "north_america":
        return "North America"
      case "europe":
        return "Europe"
      case "asia":
        return "Asia"
      case "custom":
        return "Custom"
      default:
        return territory
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>License Terms</CardTitle>
          <CardDescription>Key terms and conditions of this licensing agreement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Duration</h3>
              <p>{getDurationText(terms.duration)}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Territory</h3>
              <p>{getTerritoryText(terms.territory)}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Licensed Rights</h3>
              <p className="whitespace-pre-line">{terms.rights}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Royalties & Payments</h3>
              <p className="whitespace-pre-line">{terms.royalties}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Termination Conditions</h3>
              <p className="whitespace-pre-line">{terms.termination}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Legal Disclaimer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This agreement is stored on the Starknet blockchain and constitutes a legally binding contract between the
            parties. By signing this agreement, each party acknowledges that they have read, understood, and agree to be
            bound by the terms and conditions set forth herein. The cryptographic signatures collected represent the
            parties' consent and are considered legally equivalent to physical signatures under applicable electronic
            signature laws.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

