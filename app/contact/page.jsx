export default function Contact() {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif', lineHeight: '1.6', color: '#333' }}>
      <h1 style={{ color: '#0d9488', fontSize: '28px', fontWeight: 'bold' }}>Contact Us</h1>
      <p style={{ marginTop: '20px' }}>Have questions, feature suggestions, or business inquiries regarding Givo Food Scanner AI framework?</p>
      <p>Feel free to reach out to our management desk directly via support email:</p>
      <div style={{ background: '#f4f4f5', padding: '15px', borderRadius: '12px', display: 'inline-block', fontWeight: 'bold', margin: '15px 0' }}>
        support@givo-foodscanner.com
      </div>
      <p style={{ fontSize: '13px', opacity: 0.7 }}>We aim to respond to all technical queries within 48 business hours.</p>
      <a href="/" style={{ color: '#0d9488', textDecoration: 'none', fontWeight: 'bold', display: 'block', marginTop: '30px' }}>← Back to Home</a>
    </div>
  );
}
