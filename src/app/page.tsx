'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Star, TrendingUp, Shield, Users, Clock, Phone, ArrowRight, CheckCircle } from 'lucide-react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('')

  const testimonials = [
    {
      name: "Jean-Marc N.",
      role: "Propriétaire d'Entreprise",
      content: "CGrow a transformé ma vie financière. J'ai commencé avec 50 000 XAF et maintenant je gagne 15% quotidiennement. La plateforme est fiable et conviviale !",
      rating: 5,
      avatar: "/testimonial-1.jpg"
    },
    {
      name: "Marie L.",
      role: "Enseignante",
      content: "En tant qu'enseignante, j'avais besoin de revenus supplémentaires. CGrow m'a donné l'opportunité de faire croître mes économies exponentiellement. Fortement recommandé !",
      rating: 5,
      avatar: "/testimonial-2.jpg"
    },
    {
      name: "Paul K.",
      role: "Étudiant",
      content: "J'étais sceptique au début, mais après mon premier investissement, j'ai vu les résultats. La croissance quotidienne de 15% est réelle. Merci CGrow !",
      rating: 4,
      avatar: "/testimonial-3.jpg"
    }
  ]

  const features = [
    {
      icon: TrendingUp,
      title: "Croissance Quotidienne 15%",
      description: "Regardez votre investissement croître de 15% chaque jour avec notre système éprouvé"
    },
    {
      icon: Shield,
      title: "Plateforme Sécurisée",
      description: "Vos investissements sont protégés par des mesures de sécurité avancées"
    },
    {
      icon: Users,
      title: "Communauté de Confiance",
      description: "Rejoignez des milliers d'investisseurs satisfaits à travers le Congo"
    },
    {
      icon: Clock,
      title: "Transactions Rapides",
      description: "Traitement rapide des dépôts et retraits avec Airtel Money"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black dark">
      {/* Header */}
      <header className="border-b bg-black/90 backdrop-blur-sm sticky top-0 z-50 border-zinc-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">CG</span>
            </div>
            <span className="text-xl font-bold text-white">CGrow</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#features" className="text-white/80 hover:text-green-400 transition">Fonctionnalités</a>
            <a href="#testimonials" className="text-white/80 hover:text-green-400 transition">Témoignages</a>
            <a href="#how-it-works" className="text-white/80 hover:text-green-400 transition">Comment ça marche</a>
          </nav>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => window.location.href = '/auth'}>Connexion</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => window.location.href = '/auth'}>Commencer</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-green-900/50 text-green-300 border-green-700">
            🚀 Offre Limitée
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Investissez Intelligemment, Gagnez
            <span className="text-green-400"> 15% par Jour</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Rejoignez la plateforme d'investissement la plus fiable de CGrow. Commencez avec seulement 1 000 XAF et regardez votre argent croître exponentiellement avec notre système de croissance quotidienne de 15% éprouvé.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <div className="bg-black/80 p-6 rounded-xl shadow-lg border border-zinc-700 backdrop-blur-sm">
              <div className="text-3xl font-bold text-green-400 mb-2">15%</div>
              <div className="text-white/80">Croissance Quotidienne</div>
            </div>
            <div className="bg-black/80 p-6 rounded-xl shadow-lg border border-zinc-700 backdrop-blur-sm">
              <div className="text-3xl font-bold text-blue-400 mb-2">2min</div>
              <div className="text-white/80">Confirmation Rapide</div>
            </div>
            <div className="bg-black/80 p-6 rounded-xl shadow-lg border border-zinc-700 backdrop-blur-sm">
              <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-white/80">Support Disponible</div>
            </div>
          </div>

          <Button 
            size="lg" 
            className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4"
            onClick={() => window.location.href = '/auth'}
          >
            Commencez à Investir Maintenant
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-black/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pourquoi Choisir CGrow ?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Nous fournissons la plateforme d'investissement la plus fiable et rentable au Congo
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition bg-black/80 border-zinc-700">
                <CardHeader>
                  <feature.icon className="w-12 h-12 mx-auto text-green-400 mb-4" />
                  <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-white/80">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Comment Ça Marche
            </h2>
            <p className="text-xl text-white/80">
              Commencez à gagner en seulement 3 étapes simples
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center border-0 shadow-lg bg-black/80 border-zinc-700">
              <CardHeader>
                <div className="w-16 h-16 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-400">1</span>
                </div>
                <CardTitle className="text-white">S'inscrire</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/80">
                  Créez votre compte en quelques minutes avec seulement votre email et numéro de téléphone
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg bg-black/80 border-zinc-700">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-400">2</span>
                </div>
                <CardTitle className="text-white">Investir</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/80">
                  Envoyez XAF via Airtel Money et attendez 2 minutes pour confirmation
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg bg-black/80 border-zinc-700">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-400">3</span>
                </div>
                <CardTitle className="text-white">Grandir</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/80">
                  Regardez votre investissement croître de 15% quotidiennement, retirez à tout moment
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-black/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ce Que Disent Nos Investisseurs
            </h2>
            <p className="text-xl text-white/80">
              Rejoignez des milliers d'investisseurs satisfaits
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-black/80 border-zinc-700">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg text-white">{testimonial.name}</CardTitle>
                      <CardDescription className="text-white/80">{testimonial.role}</CardDescription>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 italic">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-700 to-green-800">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à Commencer Votre Voyage d'Investissement ?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'investisseurs congolais qui gagnent déjà 15% quotidiennement sur leurs investissements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="text-green-600 border-white hover:bg-white">
              En Savoir Plus
            </Button>
            <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100" onClick={() => window.location.href = '/auth'}>
              Commencez à Investir Maintenant
            </Button>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="bg-zinc-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-white">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-green-400">Investissement Congo 🇨🇩</h2>
              <p className="text-zinc-300 mb-4">
                CGrow est la plateforme d'investissement #1 en République Démocratique du Congo. 
                Que vous soyez à <strong>Kinshasa</strong>, <strong>Lubumbashi</strong>, <strong>Goma</strong>, 
                <strong>Bukavu</strong>, <strong>Kananga</strong> ou <strong>Kisangani</strong>, 
                investissez facilement via <strong>Airtel Money Congo</strong> et gagnez 15% quotidiennement.
              </p>
              <div className="space-y-2 text-sm text-zinc-400">
                <p>✅ Investissement Congo sécurisé</p>
                <p>✅ Mobile Money accepté</p>
                <p>✅ Rendement quotidien garanti</p>
                <p>✅ Support en français & lingala</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4 text-blue-400">Airtel Money & Mobile Money</h2>
              <p className="text-zinc-300 mb-4">
                Déposez et retirez facilement avec <strong>Airtel Money Congo</strong>. 
                Notre plateforme accepte tous les paiements mobiles pour l'<strong>investissement mobile Congo</strong>.
                <strong>Transactions sécurisées</strong> avec vérification AI pour votre protection.
              </p>
              <div className="space-y-2 text-sm text-zinc-400">
                <p>📱 Airtel Money intégré</p>
                <p>💳 Paiements mobiles instantanés</p>
                <p>🔒 Vérification AI des transactions</p>
                <p>⚡ Dépôts et retraits rapides</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Gagner Argent Internet Congo</h2>
              <p className="text-zinc-300 mb-4">
                Créez des <strong>revenus passifs</strong> avec notre système d'<strong>investissement numérique</strong>. 
                Parfait pour <strong>entrepreneurs Congo</strong>, étudiants, et professionnels cherchant à 
                <strong>gagner argent internet</strong> de manière fiable.
              </p>
              <div className="space-y-2 text-sm text-zinc-400">
                <p>💰 Revenus passifs quotidiens</p>
                <p>📈 Croissance exponentielle</p>
                <p>👥 +10,000 investisseurs satisfaits</p>
                <p>🌍 Accessible partout au Congo</p>
              </div>
            </div>
          </div>
          
          {/* Congo Cities & Keywords */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold text-white mb-4">Investissement Disponible Dans Toutes Les Villes du Congo</h3>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              {['Kinshasa', 'Lubumbashi', 'Goma', 'Bukavu', 'Kananga', 'Kisangani', 'Kolwezi', 'Matadi', 'Beni', 'Butembo'].map((city) => (
                <Badge key={city} variant="outline" className="bg-zinc-800 text-zinc-300 border-zinc-600">
                  Investissement {city}
                </Badge>
              ))}
            </div>
            <p className="text-zinc-400 mt-4 text-sm">
              <strong>Mots-clés populaires:</strong> placement congo, finance congo, business congo, 
              investir kinshasa, argent mobile congo, crowdfunding congo, investissement rentable, 
              profit quotidien, rendement garanti, plateforme investissement congo
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-yellow-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CG</span>
                </div>
                <span className="text-lg font-bold">CGrow</span>
              </div>
              <p className="text-zinc-400">
                Plateforme d'<strong>investissement Congo</strong> #1. Votre partenaire de confiance pour l'<strong>argent mobile Congo</strong> et la croissance financière via <strong>Airtel Money</strong>.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Liens Rapides</h3>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#" className="hover:text-white transition">Investissement Congo</a></li>
                <li><a href="#" className="hover:text-white transition">Airtel Money Guide</a></li>
                <li><a href="#" className="hover:text-white transition">Témoignages Congo</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Kinshasa</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#" className="hover:text-white transition">Centre d'Aide</a></li>
                <li><a href="#" className="hover:text-white transition">Politique de Confidentialité</a></li>
                <li><a href="/terms" className="hover:text-white transition">Conditions de Service</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-zinc-400">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+243 123 456 789</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Support 24/7 Congo</span>
                </div>
                <p className="text-xs mt-2">Kinshasa • Lubumbashi • Goma</p>
              </div>
            </div>
          </div>
          <div className="border-t border-zinc-800 pt-8 text-center text-zinc-400">
            <p>&copy; 2025 CGrow - Investissement Congo. Tous droits réservés. | Plateforme d'investissement #1 au Congo 🇨🇩 | Airtel Money accepté</p>
          </div>
        </div>
      </footer>
    </div>
  )
}