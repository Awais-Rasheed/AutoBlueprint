import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

const Room3D = ({ room, position, scale, showFurniture = true }) => {
  const meshRef = useRef();

  const getRoomColor = (roomName) => {
    const colors = {
      'Lounge': '#E8F4FD',
      'Bedroom': '#F0E6FF',
      'Bedroom 1': '#F0E6FF',
      'Bedroom 2': '#F0E6FF',
      'Bedroom 3': '#F0E6FF',
      'Kitchen': '#FFF2E8',
      'Bathroom': '#E6F7FF',
      'Bathroom 1': '#E6F7FF',
      'Bathroom 2': '#E6F7FF',
      'Parking': '#F5F5F5',
      'Reception': '#FFE6F0'
    };
    return colors[roomName] || '#F8F9FA';
  };

  const getFurnitureForRoom = (room) => {
    const furniture = [];
    
    if (room.name.toLowerCase().includes('bedroom')) {
      // Bed
      furniture.push({
        type: 'bed',
        position: [0, 0.5, 0],
        scale: [0.3, 0.1, 0.4],
        color: '#8B4513'
      });
      // Wardrobe
      furniture.push({
        type: 'wardrobe',
        position: [0.3, 0.5, 0],
        scale: [0.25, 0.6, 0.1],
        color: '#654321'
      });
    } else if (room.name.toLowerCase().includes('kitchen')) {
      // Kitchen island
      furniture.push({
        type: 'island',
        position: [0, 0.5, 0],
        scale: [0.6, 0.1, 0.3],
        color: '#F5DEB3'
      });
      // Refrigerator
      furniture.push({
        type: 'fridge',
        position: [-0.3, 0.5, 0],
        scale: [0.15, 0.4, 0.1],
        color: '#C0C0C0'
      });
    } else if (room.name.toLowerCase().includes('lounge')) {
      // Sofa
      furniture.push({
        type: 'sofa',
        position: [0, 0.3, 0],
        scale: [0.4, 0.1, 0.2],
        color: '#8B4513'
      });
      // Coffee table
      furniture.push({
        type: 'table',
        position: [0, 0.2, 0.2],
        scale: [0.3, 0.05, 0.15],
        color: '#D2691E'
      });
    } else if (room.name.toLowerCase().includes('bathroom')) {
      // Toilet
      furniture.push({
        type: 'toilet',
        position: [-0.2, 0.2, 0],
        scale: [0.2, 0.2, 0.2],
        color: '#FFFFFF'
      });
      // Sink
      furniture.push({
        type: 'sink',
        position: [0, 0.3, 0],
        scale: [0.3, 0.1, 0.15],
        color: '#F0F8FF'
      });
    }

    return furniture;
  };

  return (
    <group position={position} scale={scale}>
      {/* Room floor with realistic material */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[room.width, 0.2, room.height]} />
        <meshStandardMaterial 
          color={getRoomColor(room.name)} 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Room walls with realistic materials */}
      {/* Front wall */}
      <mesh position={[0, 1.5, room.height / 2]} castShadow>
        <boxGeometry args={[room.width, 3, 0.2]} />
        <meshStandardMaterial 
          color="#8B4513" 
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>
      
      {/* Back wall */}
      <mesh position={[0, 1.5, -room.height / 2]} castShadow>
        <boxGeometry args={[room.width, 3, 0.2]} />
        <meshStandardMaterial 
          color="#8B4513" 
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>
      
      {/* Left wall */}
      <mesh position={[-room.width / 2, 1.5, 0]} castShadow>
        <boxGeometry args={[0.2, 3, room.height]} />
        <meshStandardMaterial 
          color="#8B4513" 
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>
      
      {/* Right wall */}
      <mesh position={[room.width / 2, 1.5, 0]} castShadow>
        <boxGeometry args={[0.2, 3, room.height]} />
        <meshStandardMaterial 
          color="#8B4513" 
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>
      
      {/* Furniture with realistic materials */}
      {showFurniture && getFurnitureForRoom(room).map((item, index) => (
        <mesh
          key={index}
          position={item.position}
          scale={item.scale}
          castShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial 
            color={item.color} 
            roughness={0.7}
            metalness={0.2}
          />
        </mesh>
      ))}
      
      {/* Room label with better positioning */}
      <Text
        position={[0, 3.5, 0]}
        fontSize={0.6}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {room.name.toUpperCase()}
      </Text>
    </group>
  );
};

const Blueprint3D = ({ blueprint, onExport }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showFurniture, setShowFurniture] = useState(true);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      // This would typically export to GLTF format
      // For now, we'll simulate the export
      setTimeout(() => {
        onExport(null, 'blueprint-3d.gltf');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Export failed:', error);
      setIsLoading(false);
    }
  };

  if (!blueprint) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">3D Visualization</h3>
            <p className="text-gray-600">Interactive 3D model with furniture</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">Generate a blueprint to see the 3D view</p>
            <p className="text-gray-400 text-sm mt-1">Interactive 3D model with furniture placement</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">3D Visualization</h3>
            <p className="text-gray-600">Interactive 3D model with furniture</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFurniture(!showFurniture)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              showFurniture
                ? 'bg-purple-100 text-purple-700 border-2 border-purple-200'
                : 'bg-gray-100 text-gray-600 border-2 border-gray-200'
            }`}
          >
            {showFurniture ? '🪑 Hide Furniture' : '🪑 Show Furniture'}
          </button>
          <button
            onClick={handleExport}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            {isLoading ? '⏳ Exporting...' : '📦 Export GLTF'}
          </button>
        </div>
      </div>
      <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg h-96">
        <Canvas 
          camera={{ position: [20, 20, 20], fov: 60 }} 
          shadows
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight 
            position={[15, 15, 10]} 
            intensity={1.5} 
            castShadow
            shadow-mapSize-width={4096}
            shadow-mapSize-height={4096}
            shadow-camera-far={100}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />
          <directionalLight position={[-15, -15, -10]} intensity={0.8} />
          <pointLight position={[0, 15, 0]} intensity={0.7} color="#ffffff" />
          
          {blueprint.rooms.map((room, index) => {
            const x = room.x + room.width / 2;
            const z = room.y + room.height / 2;
            const scale = 0.15; // Increased scale for better visibility
            
            return (
              <Room3D
                key={index}
                room={room}
                position={[x * scale, 0, z * scale]}
                scale={[scale, 1, scale]}
                showFurniture={showFurniture}
              />
            );
          })}
          
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={10}
            maxDistance={80}
            autoRotate={false}
            autoRotateSpeed={0.5}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Canvas>
      </div>
      <div className="mt-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
        <p className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
          <span>Interactive 3D model with {blueprint.rooms.length} rooms, furniture placement, and realistic lighting</span>
        </p>
        <div className="mt-2 text-xs text-gray-500">
          <p>• Use mouse to rotate, zoom, and pan around the 3D model</p>
          <p>• Scroll to zoom in/out • Drag to rotate the view</p>
        </div>
      </div>
    </div>
  );
};

export default Blueprint3D;
