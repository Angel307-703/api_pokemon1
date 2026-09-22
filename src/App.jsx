import React, { useState } from 'react';
import './styles.css';

export default function App() {
  const [pokemonName, setPokemonName] = useState('');
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarPokemon = async (e) => {
    e.preventDefault();
    if (!pokemonName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase().trim()}`);
      if (!res.ok) throw new Error('Pokémon no encontrado');
      
      const data = await res.json();

      const alturaMetros = data.height / 10;
      const ataque = data.stats[0]?.base_stat || 0;
      const totalStats = data.stats.reduce((acc, stat) => acc + stat.base_stat, 0);

      setPokemon({
        nombre: data.name,
        imagen: data.sprites.front_default,
        altura: alturaMetros,
        peso: data.weight / 10,
        ataque: ataque,
        total: totalStats,
        tipos: data.types.map(t => t.type.name).join(', '),
        clasificacion: totalStats > 300 ? 'Débil' : 'Poderoso'
      });
    } catch (err) {
      setError(err.message);
      setPokemon(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <div className="card" style={{ padding: '24px', background: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0', maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>Analizador Pokémon</h1>
        
        <form onSubmit={buscarPokemon} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <input 
            type="text" 
            value={pokemonName} 
            onChange={(e) => setPokemonName(e.target.value)} 
            placeholder="Nombre o número de Pokémon..."
            style={{ flex: 1, padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
          />
          <button type="submit" style={{ padding: '8px 16px', background: '#f1f1f1', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }}>
            Buscar
          </button>
        </form>

        {loading && <p>Cargando información...</p>}
        {error && <p style={{ color: '#d9534f', fontSize: '14px' }}>{error}</p>}

        {pokemon && (
          <div style={{ marginTop: '16px', padding: '16px', background: '#f9f9f9', borderRadius: '6px', border: '1px solid #eee', textAlign: 'center' }}>
            <img src={pokemon.imagen} alt={pokemon.nombre} style={{ width: '96px', height: '96px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', textTransform: 'capitalize', margin: '8px 0' }}>{pokemon.nombre}</h2>
            <p style={{ margin: '4px 0', fontSize: '14px' }}>Tipos: {pokemon.tipos}</p>
            <p style={{ margin: '4px 0', fontSize: '14px' }}>Altura: {pokemon.altura} m</p>
            <p style={{ margin: '4px 0', fontSize: '14px' }}>Peso: {pokemon.peso} kg</p>
            <p style={{ margin: '4px 0', fontSize: '14px' }}>Ataque: {pokemon.ataque}</p>
            <p style={{ margin: '4px 0', fontSize: '14px' }}>Total de estadísticas: {pokemon.total}</p>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px', fontWeight: 'bold' }}>Clasificación: {pokemon.clasificacion}</p>
          </div>
        )}
      </div>
    </div>
  );
}