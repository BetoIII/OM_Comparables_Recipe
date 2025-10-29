import Link from 'next/link';

export default function Home() {
  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <div className="header">
        <h1>Comparables Viewer</h1>
        <p style={{ marginTop: '20px', fontSize: '1.1em', color: '#4a5568' }}>
          Welcome to the Comparables Viewer app. This app helps you view and manage comparable properties
          extracted from Offering Memorandum documents.
        </p>

        <div style={{ marginTop: '30px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <Link href="/comparables">
            <button className="comp-button" style={{ fontSize: '1.1em', padding: '15px 30px' }}>
              View Latest Comparables
            </button>
          </Link>

          <Link href="/comp-sets">
            <button className="comp-button comp-button-secondary" style={{ fontSize: '1.1em', padding: '15px 30px' }}>
              Manage Comp Sets
            </button>
          </Link>
        </div>

        <div style={{ marginTop: '40px', padding: '20px', background: '#f7fafc', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '10px', color: '#2d3748' }}>Getting Started</h3>
          <ol style={{ marginLeft: '20px', color: '#4a5568', lineHeight: '1.8' }}>
            <li>Run the <code>search_comps</code> recipe in Goose to extract comparables from OM PDFs</li>
            <li>Click "View Latest Comparables" to see extracted properties</li>
            <li>Select properties and create comp sets for analysis</li>
            <li>Manage your comp sets in the "Manage Comp Sets" section</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
