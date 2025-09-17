import { Users, BookOpen, MessageCircle, Shield, Heart, Stethoscope } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";


interface HomeProps {
  onSignIn: () => void;
  onJoinCommunity: () => void;
}
const Home = ({ onSignIn, onJoinCommunity }: HomeProps) => {

 
  return (
    <div>
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Heart className="size-8 text-primary" />
              <span className="text-xl font-semibold">Community Of Practice</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={onSignIn}>Sign In</Button>
              <Button onClick={onJoinCommunity}>Join Community</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">Professional Healthcare Community</Badge>
              <h1 className="text-4xl lg:text-6xl mb-6">
                Empowering Midwives Through 
                <span className="text-primary"> Shared Knowledge</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Join a supportive community of midwifery professionals sharing expertise, 
                best practices, and compassionate care techniques for birthing families.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg">
                  <Users className="mr-2 size-5" />
                  Join the Community
                </Button>
      
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback 
                src="https://images.pexels.com/photos/7579826/pexels-photo-7579826.jpeg"
                alt="Healthcare professional providing compassionate care"
                className="rounded-xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4  bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl mb-6">
            A Safe Space for Midwifery Excellence
          </h2>
          <p className="text-lg text-muted-foreground mb-12 leading-relaxed sm:px-6 lg:px-8">
    The Ministry of Health (MoH) of Eswatini, through Sexual and Reproductive Health (SRH), Maternal,
Neonatal, and Child Health (MNCH), established a web-based platform, Community of Practice (CoP)
for midwives in the country with technical support from Health Management Information System
(HMIS). <br /> <br />
The goal of the CoP is forming a network of practitioners who share a common interest in maternal
and neonatal care. The CoP aims to foster discussions and activities that promote knowledge
exchange, build expertise, and facilitate collaboration. It serves as a resource and support network,
drawing on the diverse skills and experiences of midwifery professionals from various locations to
enhance education and practice in the field.
          </p>
        </div>
      </section>


          <div className="grid md:grid-cols-3 gap-12 text-center px-4 max-w-7xl mx-auto pb-16">
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Users className="size-8 text-primary" />
              </div>
              <h3 className="text-xl mb-2">Vision</h3>
              <p className="text-muted-foreground">To build a capacitated and competent midwifery workforce providing quality, sustainable, efficient,
effective and rights-based maternal and neonatal health services ensuring the well-being of the
population of Eswatini.</p>
            </div>
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <MessageCircle className="size-8 text-primary" />
              </div>
              <h3 className="text-xl mb-2">Mission</h3>
              <p className="text-muted-foreground">Bringing together in unity the country’s midwifery professionals to learn and grow together and maximize
their contribution to the country’s efforts in improving maternal and neonatal health outcomes using various
engagement platforms, technology and evidence-based decision making for best practices</p>
            </div>
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <BookOpen className="size-8 text-primary" />
              </div>
              <h3 className="text-xl mb-2">Purpose</h3>
              <p className="text-muted-foreground">Providing a professional platform where nurse-midwives in Eswatini engage with each other, share
knowledge, experiences and expertise towards improving midwifery practice with subsequent
improvement in level of midwifery competency thereby helping to eradicate maternal and neonatal
morbidity and mortality</p>
            </div>
          </div>
      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl mb-6">
              Everything You Need for Professional Growth
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Access comprehensive resources, connect with peers, and enhance your midwifery practice 
              through our specialized forum features.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-2">
                  <MessageCircle className="size-6 text-primary" />
                </div>
                <CardTitle>Case Discussions</CardTitle>
                <CardDescription>
                  Share challenging cases and receive expert guidance from experienced midwives
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-2">
                  <BookOpen className="size-6 text-primary" />
                </div>
                <CardTitle>Educational Resources</CardTitle>
                <CardDescription>
                  Access the latest research, protocols, and evidence-based practice guidelines
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-2">
                  <Shield className="size-6 text-primary" />
                </div>
                <CardTitle>Privacy & Ethics</CardTitle>
                <CardDescription>
                  Secure, confidential discussions with strict professional ethics standards
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-2">
                  <Stethoscope className="size-6 text-primary" />
                </div>
                <CardTitle>Clinical Skills</CardTitle>
                <CardDescription>
                  Share techniques, skills, and innovations in birthing care and support
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-2">
                  <Users className="size-6 text-primary" />
                </div>
                <CardTitle>Mentorship Network</CardTitle>
                <CardDescription>
                  Connect with mentors and support new midwives entering the profession
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-2">
                  <Heart className="size-6 text-primary" />
                </div>
                <CardTitle>Emotional Support</CardTitle>
                <CardDescription>
                  Find community support for the emotional challenges of midwifery practice
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Connect with fellow midwives, share your expertise, and continue growing 
            as a healthcare professional dedicated to birthing families.
          </p>
          <div className="flex  justify-center">
            <Button size="lg" variant="secondary">
              <Users className="mr-2 size-5" />
              Join the Forum
            </Button>
        
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="size-6 text-primary" />
                <span className="text-lg font-semibold">MidwifeCare Forum</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Empowering midwives through shared knowledge and professional community.
              </p>
              <p className="text-sm text-muted-foreground">
                © 2025 MidwifeCare Forum. All rights reserved.
              </p>
            </div>

         
        </div>
      </footer>
    </div>
    </div>
  )
}

export default Home