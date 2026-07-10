export default function Terms() {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif', lineHeight: '1.6', color: '#333' }}>
      <h1 style={{ color: '#0d9488', fontSize: '28px', fontWeight: 'bold' }}>Terms of Service</h1>
      <p style={{ marginTop: '20px' }}>By accessing and using Givo, you agree to comply with our standard terms of use.</p>
      <p><b>Usage Scope:</b> This application provides estimated nutritional values using automated vision models. It should be used strictly for information and educational guidelines.</p>
      <p><b>Liability Disclaimer:</b> Givo is not responsible for any clinical dietary complications or calculations mismatch. Always cross-verify meal logs with clinical supervisors.</p>
      <a href="/" style={{ color: '#0d9488', textDecoration: 'none', fontWeight: 'bold', display: 'block', marginTop: '30px' }}>← Back to Home</a>
    </div>
  );
}
