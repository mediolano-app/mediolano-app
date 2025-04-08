import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getLicensingOptions } from "@/lib/mockAssetDashboard"

export function LicensingOptions() {
  const options = getLicensingOptions()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pre-defined Licensing Options</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        {options.map((option, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{option.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{option.description}</p>
              <ul className="list-disc list-inside mb-4">
                {option.rights.map((right, i) => (
                  <li key={i}>{right}</li>
                ))}
              </ul>
              <p className="font-bold mb-4">Price: {option.price} ETH</p>
              <Button className="w-full">Select</Button>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}

