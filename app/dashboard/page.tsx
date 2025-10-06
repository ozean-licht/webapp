'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout } from "@/components/app-layout"
import { SpanDesign } from "@/components/span-design"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Video,
  ShoppingBag,
  User,
  Receipt,
  Play,
  Clock,
  CheckCircle,
  Star,
  Crown,
  Sparkles,
  Heart,
  Compass,
  Moon,
  Sun,
  Camera,
  Lock,
  Shield,
  Upload,
  Mail,
  Settings,
  Bell,
  CreditCard,
  BarChart3,
  TrendingUp,
  Users,
  Award,
  Calendar,
  Download,
  Eye,
  EyeOff
} from 'lucide-react'

interface User {
  id: string
  email: string
  created_at: string
  profile_image?: string
  full_name?: string
  bio?: string
}

interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const router = useRouter()

  // TEMPORÄR: Auth-Schutz deaktiviert für Entwicklung
  useEffect(() => {
    // Mock User für Entwicklung
    const mockUser = {
      id: 'temp-user-id',
      email: 'user@ozean-licht.com',
      created_at: new Date().toISOString(),
      profile_image: 'https://api.ozean-licht.com/storage/v1/object/public/assets/People%20Illustration/People_6.png',
      full_name: 'Lichtarbeiter Max',
      bio: 'Auf dem Weg zur Erleuchtung durch metaphysisches Wissen und galaktische Weisheiten.'
    }
    setUser(mockUser)
    setLoading(false)
  }, [])

  // Handler für Profil-Bild Upload
  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setProfileImageFile(file)
    setUploadingImage(true)

    // Mock Upload-Prozess
    setTimeout(() => {
      const imageUrl = URL.createObjectURL(file)
      setUser(prev => prev ? { ...prev, profile_image: imageUrl } : null)
      setUploadingImage(false)
      setProfileImageFile(null)
    }, 2000)
  }

  // Handler für Passwort-Reset
  const handlePasswordReset = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Die neuen Passwörter stimmen nicht überein!')
      return
    }

    // Mock Passwort-Reset
    alert('Passwort erfolgreich geändert!')
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setShowPasswordDialog(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AppLayout>
      <div className="p-6">
        {/* Header Section with SpanDesign */}
        <div className="text-center mb-12">
          <SpanDesign>Meine Zentrale</SpanDesign>
        </div>

        {/* Personalisiertes Willkommen */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-cinzel-decorative font-normal text-foreground mb-8">
            Sei gegrüßt, {user?.full_name || user?.email.split('@')[0]}
          </h1>

          {/* Profil-Bereich zentriert */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={user?.profile_image || "https://api.ozean-licht.com/storage/v1/object/public/assets/People%20Illustration/People_6.png"}
                alt={user?.full_name || user?.email.split('@')[0]}
              />
              <AvatarFallback className="bg-primary/20 text-primary text-sm">
                {user?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="text-center">
              <h2 className="text-xl font-cinzel-decorative font-normal text-foreground mb-1">
                {user?.full_name || `Lichtarbeiter ${user?.email.split('@')[0]}`}
              </h2>
              <p className="text-muted-foreground text-sm mb-2">
                Mitglied seit {new Date(user.created_at).toLocaleDateString('de-DE')}
              </p>
              <p className="text-primary/70 text-xs">
                Mitgliedsnummer: #{user.id.slice(-6).toUpperCase()}
              </p>
            </div>
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Dein spiritueller Raum für tiefe Transformation, galaktisches Wissen und die Verbindung mit deinem höheren Selbst
          </p>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-primary/5 border border-primary/20">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Übersicht</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Kurse</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Einstellungen</span>
            </TabsTrigger>
          </TabsList>

          {/* Übersicht Tab */}
          <TabsContent value="overview">
            <div className="space-y-8">
              {/* Welcome Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/20 rounded-lg">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">3</p>
                      <p className="text-sm text-muted-foreground">Aktive Kurse</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <Award className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">85%</p>
                      <p className="text-sm text-muted-foreground">Gesamtfortschritt</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">47h</p>
                      <p className="text-sm text-muted-foreground">Lernzeit</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">+12%</p>
                      <p className="text-sm text-muted-foreground">Diese Woche</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-cinzel-decorative font-normal">
                    <Calendar className="h-5 w-5" />
                    Letzte Aktivitäten
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">Sirianische Lichtkodierungen - Modul 2 abgeschlossen</p>
                        <p className="text-sm text-muted-foreground">Vor 2 Stunden</p>
                      </div>
                      <Badge variant="secondary">+25 XP</Badge>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">Neue Transmission verfügbar: Plejadische Heilung</p>
                        <p className="text-sm text-muted-foreground">Vor 1 Tag</p>
                      </div>
                      <Badge variant="outline">Neu</Badge>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">Wöchentliches Ziel erreicht: 5h Lernzeit</p>
                        <p className="text-sm text-muted-foreground">Vor 3 Tagen</p>
                      </div>
                      <Award className="h-4 w-4 text-yellow-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-primary/20 hover:border-primary/40">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Play className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-cinzel-decorative font-normal mb-2">Kurs fortsetzen</h3>
                    <p className="text-sm text-muted-foreground mb-4">Setze deine spirituelle Reise fort</p>
                    <Button className="w-full">Weiterlernen</Button>
                  </div>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-primary/20 hover:border-primary/40">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Moon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-cinzel-decorative font-normal mb-2">Transmissions</h3>
                    <p className="text-sm text-muted-foreground mb-4">Höre galaktische Weisheiten</p>
                    <Button variant="outline" className="w-full">Anhören</Button>
                  </div>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-primary/20 hover:border-primary/40">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-cinzel-decorative font-normal mb-2">Community</h3>
                    <p className="text-sm text-muted-foreground mb-4">Verbinde dich mit Lichtarbeitern</p>
                    <Button variant="outline" className="w-full">Teilnehmen</Button>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Profil Tab */}
          <TabsContent value="profile">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-cinzel-decorative font-normal mb-4">Dein Spirituelles Profil</h2>
                <p className="text-muted-foreground">Verwalte deine persönlichen Daten und dein spirituelles Profil</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profil Bild */}
                <Card className="p-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-cinzel-decorative font-normal">
                      <Camera className="h-5 w-5" />
                      Profilbild
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-center">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={user?.profile_image} alt={user?.full_name} />
                        <AvatarFallback className="text-2xl">
                          {user?.full_name?.charAt(0) || user?.email?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profile-image">Neues Bild hochladen</Label>
                      <Input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageUpload}
                        disabled={uploadingImage}
                        className="cursor-pointer"
                      />
                      {uploadingImage && (
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          Hochladen...
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Persönliche Informationen */}
                <Card className="p-6 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-cinzel-decorative font-normal">
                      <User className="h-5 w-5" />
                      Persönliche Informationen
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Vollständiger Name</Label>
                        <Input
                          id="full_name"
                          defaultValue={user?.full_name}
                          placeholder="Dein spiritueller Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-Mail</Label>
                        <Input
                          id="email"
                          defaultValue={user?.email}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Spirituelle Biografie</Label>
                      <Textarea
                        id="bio"
                        defaultValue={user?.bio}
                        placeholder="Erzähle etwas über deinen spirituellen Weg..."
                        rows={4}
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button className="flex-1">
                        <Upload className="h-4 w-4 mr-2" />
                        Speichern
                      </Button>
                      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            <Lock className="h-4 w-4 mr-2" />
                            Passwort ändern
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Passwort ändern</DialogTitle>
                            <DialogDescription>
                              Gib dein aktuelles Passwort und ein neues Passwort ein.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="current-password">Aktuelles Passwort</Label>
                              <div className="relative">
                                <Input
                                  id="current-password"
                                  type={showCurrentPassword ? "text" : "password"}
                                  value={passwordForm.currentPassword}
                                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="new-password">Neues Passwort</Label>
                              <div className="relative">
                                <Input
                                  id="new-password"
                                  type={showNewPassword ? "text" : "password"}
                                  value={passwordForm.newPassword}
                                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirm-password">Passwort bestätigen</Label>
                              <Input
                                id="confirm-password"
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                              Abbrechen
                            </Button>
                            <Button onClick={handlePasswordReset}>
                              Passwort ändern
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Kurse Tab */}
          <TabsContent value="courses">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-cinzel-decorative font-normal mb-4">Meine Kurse</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Verfolge deinen Fortschritt und setze deine spirituelle Entwicklung fort.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-primary/20 hover:border-primary/40 bg-gradient-to-br from-primary/5 to-transparent">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 relative">
                    <img
                      src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/sirian-gateway-event-thumbnail.webp"
                      alt="Sirianische Lichtkodierungen"
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center opacity-0 hover:opacity-100 transition-opacity p-4">
                      <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-lg">
                        <Play className="h-4 w-4 mr-2" />
                        Fortsetzen
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                        Sirianisch
                      </Badge>
                      <div className="flex items-center gap-1">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                        </div>
                        <span className="text-xs text-muted-foreground">75%</span>
                      </div>
                    </div>
                    <h3 className="font-medium mb-2 font-cinzel text-lg">Sirianische Lichtkodierungen</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Entdecke die heilenden Frequenzen der Sirianischen Lichtkodierungen.
                    </p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Modul 2 von 3</span>
                      <span>47 Lektionen</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-primary/20 hover:border-primary/40 bg-gradient-to-br from-primary/5 to-transparent">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 relative">
                    <img
                      src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/free-video-1.webp"
                      alt="Plejadian Ascension"
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center opacity-0 hover:opacity-100 transition-opacity p-4">
                      <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-lg">
                        <Play className="h-4 w-4 mr-2" />
                        Starten
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                        Plejadisch
                      </Badge>
                      <div className="flex items-center gap-1">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500" style={{ width: '25%' }}></div>
                        </div>
                        <span className="text-xs text-muted-foreground">25%</span>
                      </div>
                    </div>
                    <h3 className="font-medium mb-2 font-cinzel text-lg">Plejadian Ascension</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Aktiviere dein göttliches Potential mit plejadischem Wissen.
                    </p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Modul 1 von 5</span>
                      <span>32 Lektionen</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-primary/20 hover:border-primary/40 bg-gradient-to-br from-primary/5 to-transparent">
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Neue Kurse entdecken</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Erweitere dein spirituelles Wissen mit weiteren Kursen.
                    </p>
                    <Button className="w-full" onClick={() => router.push('/courses')}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Kurse durchsuchen
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Einstellungen Tab */}
          <TabsContent value="settings">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-cinzel-decorative font-normal mb-4">Einstellungen</h2>
                <p className="text-muted-foreground">Verwalte deine Kontoeinstellungen und Präferenzen</p>
              </div>

              <div className="space-y-6">
                <Card className="p-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-cinzel-decorative font-normal">
                      <Bell className="h-5 w-5" />
                      Benachrichtigungen
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Neue Kurse verfügbar</p>
                        <p className="text-sm text-muted-foreground">Erhalte Benachrichtigungen über neue Kurse</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Live Transmissions</p>
                        <p className="text-sm text-muted-foreground">Benachrichtigungen über Live-Events</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Wöchentliche Zusammenfassung</p>
                        <p className="text-sm text-muted-foreground">Wöchentlicher Fortschrittsbericht</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-cinzel-decorative font-normal">
                      <Shield className="h-5 w-5" />
                      Datenschutz & Sicherheit
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Zwei-Faktor-Authentifizierung</p>
                        <p className="text-sm text-muted-foreground">Erhöhte Sicherheit für dein Konto</p>
                      </div>
                      <Button variant="outline" size="sm">Aktivieren</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Sitzungsverwaltung</p>
                        <p className="text-sm text-muted-foreground">Verwalte aktive Sitzungen</p>
                      </div>
                      <Button variant="outline" size="sm">Verwalten</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-cinzel-decorative font-normal">
                      <CreditCard className="h-5 w-5" />
                      Abonnement & Zahlungen
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Aktueller Plan</p>
                        <p className="text-sm text-muted-foreground">Lichtarbeiter Premium - €29.99/Monat</p>
                      </div>
                      <Badge>aktiv</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Nächste Zahlung</p>
                        <p className="text-sm text-muted-foreground">15. Januar 2025</p>
                      </div>
                      <Button variant="outline" size="sm">Plan ändern</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6 border-red-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600 font-cinzel-decorative font-normal">
                      <Download className="h-5 w-5" />
                      Daten & Konto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Daten exportieren</p>
                        <p className="text-sm text-muted-foreground">Lade all deine Daten herunter</p>
                      </div>
                      <Button variant="outline" size="sm">Exportieren</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-600">Konto löschen</p>
                        <p className="text-sm text-muted-foreground">Permanente Löschung aller Daten</p>
                      </div>
                      <Button variant="destructive" size="sm">Konto löschen</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
