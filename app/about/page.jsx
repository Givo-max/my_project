export default function About() {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif', lineHeight: '1.6', color: '#333' }}>
      <h1 style={{ color: '#0d9488', fontSize: '28px', fontWeight: 'bold' }}>About Us</h1>
      <p style={{ marginTop: '20px' }}>Welcome to Givo, an intelligent web-utility platform engineered to simplify daily macro tracking and automated dietary analysis.</p>
      <p>Our application uses advanced computer vision techniques to read uploaded food pictures, generating immediate details on calories, minerals, proteins, and diabetic suitability metrics. Our mission is to make smart nutrition universally accessible with zero friction.</p>
      <a href="/" style={{ color: '#0d9488', textDecoration: 'none', fontWeight: 'bold', display: 'block', marginTop: '30px' }}>← Back to Home</a>
    </div>
  );
}
