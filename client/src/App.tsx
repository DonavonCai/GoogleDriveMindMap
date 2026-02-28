import ItemsList from './components/ItemsList';

function App() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Google Drive Mind Map</h1>
      </header>
      <main>
        <ItemsList />
      </main>
    </div>
  );
}

export default App;
