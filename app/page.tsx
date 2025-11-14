"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MapPin, Navigation, Clock, MapIcon, Star, QrCode, Languages, Menu } from 'lucide-react'
import { cn } from "@/lib/utils"
import MapView from "@/components/ui/MapView"



type Tab = "home" | "map" | "directions" | "destinations" | "more"

const busRoutes = [
  { id: "R1", name: "Route R1", color: "bg-blue-500", stops: ["Boulevard Kukulcán", "La Isla", "Playa Delfines", "Hotel Zone"] },
  { id: "R2", name: "Route R2", color: "bg-emerald-500", stops: ["Downtown", "Mercado 28", "Plaza Las Américas", "Hotel Zone"] },
  { id: "27", name: "Route 27", color: "bg-amber-500", stops: ["Centro", "Walmart", "Playa Tortugas", "Puerto Cancún"] },
]

const destinations = [
  { name: "La Isla Shopping Village", route: "R1, R2", time: "15 min", image: "/modern-shopping-mall-cancun.jpg" },
  { name: "Playa Delfines", route: "R1, R2", time: "25 min", image: "/beach-paradise-cancun.jpg" },
  { name: "Mercado 28", route: "R2", time: "20 min", image: "/traditional-mexican-market.jpg" },
  { name: "Museo Maya", route: "R1", time: "18 min", image: "/mayan-museum-modern.jpg" },
]

export default function SmartMovePage() {
const [activeTab, setActiveTab] = useState<Tab>("home")
const [origin, setOrigin] = useState("")
const [destination, setDestination] = useState("")
const [language, setLanguage] = useState("en")
  const translations = {
    en: {
      title: "SmartMove",
      subtitle: "Navigate Cancún Like a Local",
      whereAreYou: "Where are you?",
      whereTo: "Where do you want to go?",
      findRoute: "Find My Route",
      currentLocation: "Use current location",
      popularDestinations: "Popular Destinations",
      busRoutes: "Bus Routes",
      nearby: "Nearby Stops",
      home: "Home",
      map: "Map",
      directions: "Directions",
      destinations: "Places",
      more: "More"
    },
    es: {
      title: "SmartMove",
      subtitle: "Navega Cancún Como Local",
      whereAreYou: "¿Dónde estás?",
      whereTo: "¿A dónde quieres ir?",
      findRoute: "Encontrar Ruta",
      currentLocation: "Usar ubicación actual",
      popularDestinations: "Destinos Populares",
      busRoutes: "Rutas de Autobús",
      nearby: "Paradas Cercanas",
      home: "Inicio",
      map: "Mapa",
      directions: "Direcciones",
      destinations: "Lugares",
      more: "Más"
    },
    fr: {
      title: "SmartMove",
      subtitle: "Naviguez à Cancún Comme un Local",
      whereAreYou: "Où êtes-vous?",
      whereTo: "Où voulez-vous aller?",
      findRoute: "Trouver Mon Itinéraire",
      currentLocation: "Utiliser l'emplacement actuel",
      popularDestinations: "Destinations Populaires",
      busRoutes: "Lignes de Bus",
      nearby: "Arrêts à Proximité",
      home: "Accueil",
      map: "Carte",
      directions: "Directions",
      destinations: "Lieux",
      more: "Plus"
    }
  }

  const t = translations[language as keyof typeof translations]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 py-4 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t.title}</h1>
            <p className="text-sm opacity-90">{t.subtitle}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => {
              const langs = ["en", "es", "fr", "de", "pt"]
              const currentIndex = langs.indexOf(language)
              setLanguage(langs[(currentIndex + 1) % 3 ])
            }}
          >
            <Languages className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-md mx-auto p-4">
          {activeTab === "home" && (
            <div className="space-y-6">
              {/* Origin/Destination Selector */}
              <Card className="p-6 shadow-lg">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      {t.whereAreYou}
                    </label>
                    <Input 
                      placeholder="Hotel Riu Caribe, Current location..." 
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="text-base"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-primary hover:text-primary"
                    >
                      <Navigation className="h-3 w-3 mr-1" />
                      {t.currentLocation}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-secondary" />
                      {t.whereTo}
                    </label>
                    <Input 
                      placeholder="La Isla, Playa Delfines, Mercado 28..." 
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="text-base"
                    />
                  </div>
  <Button
  className="w-full text-base py-6"
  size="lg"
  disabled={!origin || !destination}
  onClick={() => setActiveTab("map")}
>
  {t.findRoute}
</Button>
                </div>
              </Card>

              {/* Popular Destinations */}
              <div>
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  {t.popularDestinations}
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {destinations.slice(0, 4).map((dest) => (
                    <Card key={dest.name} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex gap-3 p-3">
                        <img 
                          src={dest.image || "/placeholder.svg"} 
                          alt={dest.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm mb-1 truncate">{dest.name}</h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                            <Clock className="h-3 w-3" />
                            <span>{dest.time}</span>
                          </div>
                          <div className="flex gap-1 flex-wrap">
                            {dest.route.split(", ").map((route) => (
                              <span 
                                key={route}
                                className={cn(
                                  "text-xs px-2 py-0.5 rounded-full text-white font-medium",
                                  route === "R1" && "bg-blue-500",
                                  route === "R2" && "bg-emerald-500",
                                  route === "27" && "bg-amber-500"
                                )}
                              >
                                {route}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Bus Routes Quick View */}
              <div>
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <MapIcon className="h-5 w-5 text-primary" />
                  {t.busRoutes}
                </h2>
                <div className="space-y-2">
                  {busRoutes.map((route) => (
                    <Card key={route.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white font-bold", route.color)}>
                          {route.id}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm mb-1">{route.name}</h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {route.stops.join(" • ")}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "map" && (
             <div className="space-y-4">
    <MapView originText={origin} destinationText={destination} />
  </div>
          )}

          {activeTab === "directions" && (
            <div className="space-y-4">
              <Card className="p-6 bg-primary/10 border-primary">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Walk to bus stop</h3>
                    <p className="text-sm text-muted-foreground">Walk 120 m to Playa Tortugas stop</p>
                    <p className="text-xs text-primary font-medium mt-1">2 minutes</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                    R1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Take bus R1</h3>
                    <p className="text-sm text-muted-foreground">Travel for 7 stops</p>
                    <p className="text-xs text-primary font-medium mt-1">15 minutes</p>
                    <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100">We'll notify you before your stop</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Get off at La Isla</h3>
                    <p className="text-sm text-muted-foreground">Walk 90 m to final destination</p>
                    <p className="text-xs text-primary font-medium mt-1">2 minutes</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-secondary/20 border-secondary">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-secondary mx-auto mb-2" />
                  <p className="font-semibold">Total Time: 19 minutes</p>
                  <p className="text-sm text-muted-foreground mt-1">You'll save $180 MXN vs. taxi</p>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "destinations" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {destinations.map((dest) => (
                  <Card key={dest.name} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <img 
                      src={dest.image || "/placeholder.svg"} 
                      alt={dest.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-bold mb-2">{dest.name}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{dest.time}</span>
                        </div>
                        <div className="flex gap-1">
                          {dest.route.split(", ").map((route) => (
                            <span 
                              key={route}
                              className={cn(
                                "text-xs px-3 py-1 rounded-full text-white font-medium",
                                route === "R1" && "bg-blue-500",
                                route === "R2" && "bg-emerald-500",
                                route === "27" && "bg-amber-500"
                              )}
                            >
                              {route}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button className="w-full mt-3" variant="outline">
                        Get Directions
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "more" && (
            <div className="space-y-4">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-3">
                  <QrCode className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Scan QR at Bus Stop</h3>
                    <p className="text-sm text-muted-foreground">Get real-time bus information</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-3">
                  <Languages className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Language: {language.toUpperCase()}</h3>
                    <p className="text-sm text-muted-foreground">English, Español, Français, Deutsch, Português</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-3">
                  <MapIcon className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Offline Mode</h3>
                    <p className="text-sm text-muted-foreground">Download routes for offline use</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-primary/10 border-primary">
                <h3 className="font-semibold mb-2">First Day in Cancún?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Check out our beginner-friendly routes and safe places to visit
                </p>
                <Button className="w-full">
                  View First Day Guide
                </Button>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-2">Night Mode Safety</h3>
                <p className="text-sm text-muted-foreground">
                  Only shows well-lit stops and safe routes after sunset
                </p>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-around py-2">
          <button 
            onClick={() => setActiveTab("home")}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors",
              activeTab === "home" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <MapPin className="h-5 w-5" />
            <span className="text-xs font-medium">{t.home}</span>
          </button>
          <button 
            onClick={() => setActiveTab("map")}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors",
              activeTab === "map" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <MapIcon className="h-5 w-5" />
            <span className="text-xs font-medium">{t.map}</span>
          </button>
          <button 
            onClick={() => setActiveTab("directions")}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors",
              activeTab === "directions" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Navigation className="h-5 w-5" />
            <span className="text-xs font-medium">{t.directions}</span>
          </button>
          <button 
            onClick={() => setActiveTab("destinations")}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors",
              activeTab === "destinations" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Star className="h-5 w-5" />
            <span className="text-xs font-medium">{t.destinations}</span>
          </button>
          <button 
            onClick={() => setActiveTab("more")}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors",
              activeTab === "more" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Menu className="h-5 w-5" />
            <span className="text-xs font-medium">{t.more}</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
