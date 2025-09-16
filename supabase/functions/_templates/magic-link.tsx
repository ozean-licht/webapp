import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'https://esm.sh/@react-email/components@0.0.15';

import { render } from 'https://esm.sh/@react-email/render@0.0.17';

interface MagicLinkEmailProps {
  supabase_url: string;
  email_action_type: string;
  redirect_to: string;
  token_hash: string;
  token: string;
}

export const MagicLinkEmail = ({
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
  token,
}: MagicLinkEmailProps) => {
  const magicLink = `${supabase_url}/auth/v1/verify?token=${token}&type=${email_action_type}&redirect_to=${encodeURIComponent(redirect_to)}`;

  return (
    <Html>
      <Head>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
          `}
        </style>
      </Head>
      <Preview>Dein sicherer Magic Link für den Login bei Ozean Licht</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/Akadmie%20Komprimiert.png"
            width="60"
            height="60"
            alt="Ozean Licht Logo"
            style={logo}
          />
          <Text style={heading}>Willkommen zurück!</Text>
          <Text style={paragraph}>
            Du hast dich für einen sicheren Login bei Ozean Licht entschieden.
            Klicke einfach auf den Button unten, um dich automatisch anzumelden.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={magicLink}>
              🔐 Mit Magic Link anmelden
            </Button>
          </Section>
          <Text style={paragraph}>
            Dieser Link ist 1 Stunde gültig und kann nur einmal verwendet werden.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            Falls du diese E-Mail nicht erwartet hast, kannst du sie einfach ignorieren.
          </Text>
          <Text style={footer}>
            Bei Fragen kontaktiere uns gerne unter{' '}
            <Link href="mailto:hello@ozean-licht.com" style={link}>
              hello@ozean-licht.com
            </Link>
          </Text>
          <Text style={footer}>
            © 2025 Ozean Licht™ - Alle Rechte vorbehalten
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default MagicLinkEmail;

const main = {
  backgroundColor: '#0a141f',
  fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const logo = {
  margin: '0 auto',
  marginBottom: '24px',
};

const heading = {
  fontSize: '28px',
  fontWeight: '700',
  color: '#ffffff',
  textAlign: 'center' as const,
  margin: '30px 0',
  fontFamily: "'Cinzel Decorative', serif",
  textShadow: '0 0 12px rgba(255, 255, 255, 0.3)',
  letterSpacing: '1px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#c4c8d4',
  margin: '16px 0',
  fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontWeight: '400',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#188689',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
  border: '2px solid #188689',
  fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  boxShadow: '0 4px 12px rgba(24, 134, 137, 0.3)',
  transition: 'all 0.3s ease',
};

const hr = {
  borderColor: '#0e282e',
  margin: '24px 0',
};

const footer = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '18px',
  textAlign: 'center' as const,
  margin: '16px 0',
  fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontWeight: '300',
};

const link = {
  color: '#188689',
  textDecoration: 'underline',
  fontWeight: '500',
};
