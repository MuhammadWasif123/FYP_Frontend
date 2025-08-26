import { Shield, Brain, Map, MessageCircle, BarChart3, Users } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Anonymous Reporting",
      description: "Report crimes safely and anonymously with end-to-end encryption protecting your identity.",
      color: "from-primary to-primary-light"
    },
    {
      icon: Brain,
      title: "AI-Powered Analytics",
      description: "Advanced machine learning algorithms analyze crime patterns and predict hotspots for proactive measures.",
      color: "from-secondary to-secondary-light"
    },
    {
      icon: Map,
      title: "Interactive Crime Map",
      description: "Real-time visualization of crime data with interactive maps showing safe zones and risk areas.",
      color: "from-accent to-accent-light"
    },
    {
      icon: MessageCircle,
      title: "Secure Communication",
      description: "End-to-end encrypted messaging with authorities and AI chatbot assistance for guidance.",
      color: "from-success to-success-light"
    },
    {
      icon: BarChart3,
      title: "Real-time Dashboard",
      description: "Comprehensive analytics dashboard for law enforcement with actionable insights and trends.",
      color: "from-primary to-secondary"
    },
    {
      icon: Users,
      title: "Community Safety",
      description: "Building trust between citizens and authorities through transparent, data-driven crime prevention.",
      color: "from-secondary to-accent"
    }
  ];

  return (
    <section id="features" className="section-padding bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16 fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Powerful Features for
            <span className="text-gradient"> Safer Communities</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our platform combines cutting-edge technology with user-centric design to create 
            a comprehensive crime reporting and prevention ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="feature-card fade-in hover-glow"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex p-3 md:p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-4 md:mb-6`}>
                  <Icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;