  import React, { useEffect, useRef, useState } from 'react';
  import * as fabric from 'fabric';

  const Blueprint2D = ({ blueprint, onExport }) => {
    const canvasRef = useRef(null);
    const fabricCanvasRef = useRef(null);
    const [canvasSize, setCanvasSize] = useState({ width: 900, height: 700 });
    const [showFurniture, setShowFurniture] = useState(true);

    useEffect(() => {
      if (!blueprint) return;

      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose(); // Clean up old instance
        fabricCanvasRef.current = null;
      }

      const canvas = new fabric.Canvas(canvasRef.current, {
        width: canvasSize.width,
        height: canvasSize.height,
        backgroundColor: '#ffffff'
      });
      fabricCanvasRef.current = canvas;


      // --- Normalize and scale blueprint before drawing ---
      const minX = Math.min(...blueprint.rooms.map(r => r.x));
      const minY = Math.min(...blueprint.rooms.map(r => r.y));
      const maxX = Math.max(...blueprint.rooms.map(r => r.x + r.width));
      const maxY = Math.max(...blueprint.rooms.map(r => r.y + r.height));

      const plotWidth = maxX - minX;
      const plotHeight = maxY - minY;

      // Store dimensions for scaling
      blueprint.plotDimensions = { width: plotWidth, height: plotHeight };

      // Calculate scale to fit canvas
      // ✅ Auto-scale and center the blueprint within the canvas
      const maxWidth = canvasSize.width * 0.8;
      const maxHeight = canvasSize.height * 0.8;
      const scaleX = maxWidth / blueprint.plotDimensions.width;
      const scaleY = maxHeight / blueprint.plotDimensions.height;
      const scale = Math.min(scaleX, scaleY);

      // Calculate centering offset
      const offsetX = (canvasSize.width - blueprint.plotDimensions.width * scale) / 2;
      const offsetY = (canvasSize.height - blueprint.plotDimensions.height * scale) / 2;


      // === Add light architectural grid background ===
      for (let i = 0; i < canvas.width; i += 50) {
        canvas.add(new fabric.Line([i, 0, i, canvas.height], {
          stroke: '#d0e0ff',
          selectable: false,
          evented: false
        }));
      }
      for (let j = 0; j < canvas.height; j += 50) {
        canvas.add(new fabric.Line([0, j, canvas.width, j], {
          stroke: '#d0e0ff',
          selectable: false,
          evented: false
        }));
      }


      fabricCanvasRef.current = canvas;

      // Clear existing objects
      canvas.clear();

      // Calculate scale factor to fit blueprint in canvas

      // Draw rooms with architectural blueprint styling
      blueprint.rooms.forEach((room, index) => {
        const roomX = (room.x - minX) * scale + offsetX;
        const roomY = (room.y - minY) * scale + offsetY;

        const roomWidth = room.width * scale;
        const roomHeight = room.height * scale;

        // Room background - transparent for blueprint style
        const roomRect = new fabric.Rect({
          left: roomX,
          top: roomY,
          width: roomWidth,
          height: roomHeight,
          fill: '#e6f0ff', // soft blueprint fill
          stroke: '#003366', // deep blueprint outline
          strokeWidth: 1.5,
          selectable: false,
          evented: false,
          opacity: 0.9
        });


        // Room area label (in square feet)
        const roomArea = Math.round(room.width * room.height);
        const areaLabel = new fabric.Textbox(`${roomArea} SF`, {
          left: roomX + roomWidth / 2,
          top: roomY + roomHeight / 2 - 8,
          fontSize: 10,
          fontWeight: 'bold',
          fill: '#000000',
          textAlign: 'center',
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false
        });

        // Room name label
        const roomLabel = new fabric.Textbox(room.name.toUpperCase(), {
          left: roomX + roomWidth / 2,
          top: roomY + roomHeight / 2 + 8,
          fontSize: 12,
          fontWeight: 'bold',
          fill: '#000000',
          textAlign: 'center',
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false
        });

        canvas.add(roomRect);
        canvas.add(areaLabel);
        canvas.add(roomLabel);

        // --- Draw outer boundary (plot outline) ---
        


        // Add furniture if enabled
        if (showFurniture) {
          const furniture = getFurnitureForRoom(room, scale, offsetX, offsetY);
          furniture.forEach((item) => {
            const furnitureRect = new fabric.Rect({
              left: item.x,
              top: item.y,
              width: item.width,
              height: item.height,
              fill: item.color,
              stroke: '#4A5568',
              strokeWidth: 1,
              rx: 2,
              ry: 2,
              selectable: false,
              evented: false,
              opacity: 0.8
            });

            // Add furniture label
            const furnitureLabel = new fabric.Textbox(item.type, {
              left: item.x + item.width / 2,
              top: item.y + item.height / 2,
              fontSize: 8,
              fill: '#2D3748',
              textAlign: 'center',
              originX: 'center',
              originY: 'center',
              selectable: false,
              evented: false
            });

            canvas.add(furnitureRect);
            canvas.add(furnitureLabel);
          });
        }
      }
    
    );

    const plotRect = new fabric.Rect({
      left: offsetX - 5,
      top: offsetY - 5,
      width: plotWidth * scale + 10,
      height: plotHeight * scale + 10,
      fill: 'transparent',
      stroke: '#003366',
      strokeWidth: 2,
      selectable: false,
      evented: false
    });

    canvas.add(plotRect); 

    // ✅ Version-safe way to move the plot rectangle behind everything else
    if (canvas.sendToBack) {
      // Fabric v5
      canvas.sendToBack(plotRect);
    } else {
      // Fabric v4 fallback
      canvas._objects = [plotRect, ...canvas._objects.filter(obj => obj !== plotRect)];
      canvas.renderAll();
    }

      // Draw walls with architectural blueprint styling
      blueprint.walls.forEach((wall) => {
        const wallRect = new fabric.Rect({
          left: wall.x * scale + 50,
          top: wall.y * scale + 50,
          width: wall.width * scale,
          height: wall.height * scale,
          fill: '#000000',
          stroke: '#000000',
          strokeWidth: 1,
          selectable: false,
          evented: false
        });

        canvas.add(wallRect);
      });

      // Draw doors with architectural symbols
      blueprint.rooms.forEach((room) => {
        room.doors.forEach((door) => {
          // Door opening (gap in wall)
          const doorOpening = new fabric.Rect({
            left: door.x * scale + 50,
            top: door.y * scale + 50,
            width: door.width * scale,
            height: door.height * scale,
            fill: 'transparent',
            stroke: '#000000',
            strokeWidth: 1,
            selectable: false,
            evented: false
          });

          // Door swing arc (quarter circle)
          const doorArc = new fabric.Circle({
            left: door.x * scale + 50 + (door.width * scale) / 2,
            top: door.y * scale + 50 + (door.height * scale) / 2,
            radius: door.width * scale / 2,
            startAngle: 0,
            endAngle: Math.PI / 2,
            fill: 'transparent',
            stroke: '#000000',
            strokeWidth: 1,
            selectable: false,
            evented: false
          });

          canvas.add(doorOpening);
          canvas.add(doorArc);
        });
      });

      // Draw windows with architectural symbols
      blueprint.rooms.forEach((room) => {
        room.windows.forEach((window) => {
          // Window opening (gap in wall)
          const windowOpening = new fabric.Rect({
            left: window.x * scale + 50,
            top: window.y * scale + 50,
            width: window.width * scale,
            height: window.height * scale,
            fill: 'transparent',
            stroke: '#000000',
            strokeWidth: 1,
            selectable: false,
            evented: false
          });

          // Window glass lines (parallel lines)
          const windowLine1 = new fabric.Line([
            window.x * scale + 50,
            window.y * scale + 50 + (window.height * scale) / 3,
            window.x * scale + 50 + window.width * scale,
            window.y * scale + 50 + (window.height * scale) / 3
          ], {
            stroke: '#000000',
            strokeWidth: 1,
            selectable: false,
            evented: false
          });

          const windowLine2 = new fabric.Line([
            window.x * scale + 50,
            window.y * scale + 50 + (window.height * scale) * 2 / 3,
            window.x * scale + 50 + window.width * scale,
            window.y * scale + 50 + (window.height * scale) * 2 / 3
          ], {
            stroke: '#000000',
            strokeWidth: 1,
            selectable: false,
            evented: false
          });

          canvas.add(windowOpening);
          canvas.add(windowLine1);
          canvas.add(windowLine2);
        });
      });

      // Add legend
      addLegend(canvas);

      canvas.renderAll();

      return () => {
        canvas.dispose();
      };
    }, [blueprint, canvasSize]);

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

    const getFurnitureForRoom = (room, scale, offsetX, offsetY) => {
      const furniture = [];
      const roomWidth = room.width * scale;
      const roomHeight = room.height * scale;
      const roomX = room.x * scale + offsetX;
      const roomY = room.y * scale + offsetY;
      // Furniture placement based on room type
      if (room.name.toLowerCase().includes('bedroom')) {
        // Bed
        furniture.push({
          type: 'bed',
          x: roomX + (roomWidth * 0.1),
          y: roomY + (roomHeight * 0.1),
          width: roomWidth * 0.3,
          height: roomHeight * 0.4,
          color: '#8B4513'
        });
        // Wardrobe
        furniture.push({
          type: 'wardrobe',
          x: roomX + roomWidth * 0.6,
          y: roomY + (roomHeight * 0.1),
          width: roomWidth * 0.25,
          height: roomHeight * 0.6,
          color: '#654321'
        });
        // Desk
        furniture.push({
          type: 'desk',
          x: roomX + (roomWidth * 0.1),
          y: roomY + roomHeight * 0.6,
          width: roomWidth * 0.4,
          height: roomHeight * 0.2,
          color: '#D2691E'
        });
      } else if (room.name.toLowerCase().includes('kitchen')) {
        // Kitchen island
        furniture.push({
          type: 'island',
          x: roomX + roomWidth * 0.2,
          y: roomY + roomHeight * 0.3,
          width: roomWidth * 0.6,
          height: roomHeight * 0.3,
          color: '#F5DEB3'
        });
        // Refrigerator
        furniture.push({
          type: 'fridge',
          x: roomX + roomWidth * 0.05,
          y: roomY + (roomHeight * 0.1),
          width: roomWidth * 0.15,
          height: roomHeight * 0.4,
          color: '#C0C0C0'
        });
        // Stove
        furniture.push({
          type: 'stove',
          x: roomX + roomWidth * 0.8,
          y: roomY + (roomHeight * 0.1),
          width: roomWidth * 0.15,
          height: roomHeight * 0.2,
          color: '#696969'
        });
      } else if (room.name.toLowerCase().includes('lounge')) {
        // Sofa
        furniture.push({
          type: 'sofa',
          x: roomX + (roomWidth * 0.1),
          y: roomY + roomHeight * 0.2,
          width: roomWidth * 0.4,
          height: roomHeight * 0.2,
          color: '#8B4513'
        });
        // Coffee table
        furniture.push({
          type: 'table',
          x: roomX + roomWidth * 0.3,
          y: roomY + roomHeight * 0.5,
          width: roomWidth * 0.3,
          height: roomHeight * 0.15,
          color: '#D2691E'
        });
        // TV stand
        furniture.push({
          type: 'tv',
          x: roomX + (roomWidth * 0.1),
          y: roomY + roomHeight * 0.7,
          width: roomWidth * 0.3,
          height: roomHeight * 0.1,
          color: '#2F4F4F'
        });
      } else if (room.name.toLowerCase().includes('bathroom')) {
        // Toilet
        furniture.push({
          type: 'toilet',
          x: roomX + (roomWidth * 0.1),
          y: roomY + (roomHeight * 0.1),
          width: roomWidth * 0.2,
          height: roomHeight * 0.2,
          color: '#FFFFFF'
        });
        // Sink
        furniture.push({
          type: 'sink',
          x: roomX + roomWidth * 0.4,
          y: roomY + (roomHeight * 0.1),
          width: roomWidth * 0.3,
          height: roomHeight * 0.15,
          color: '#F0F8FF'
        });
        // Shower
        furniture.push({
          type: 'shower',
          x: roomX + (roomWidth * 0.1),
          y: roomY + roomHeight * 0.4,
          width: roomWidth * 0.3,
          height: roomHeight * 0.4,
          color: '#E0E0E0'
        });
      }

      return furniture;
    };

    const addLegend = (canvas) => {
      // Add title
      const title = new fabric.Textbox('BLUEPRINT LEGEND', {
        left: 20,
        top: 10,
        fontSize: 14,
        fontWeight: 'bold',
        fill: '#000000',
        selectable: false,
        evented: false
      });

      const legendItems = [
        { symbol: '■', label: 'WALLS', description: 'Structural walls' },
        { symbol: '▬', label: 'DOORS', description: 'Door openings' },
        { symbol: '═', label: 'WINDOWS', description: 'Window openings' },
        { symbol: '□', label: 'ROOMS', description: 'Room boundaries' }
      ];

      let yOffset = 40;
      canvas.add(title);

      legendItems.forEach((item, index) => {
        const symbol = new fabric.Textbox(item.symbol, {
          left: 20,
          top: yOffset,
          fontSize: 16,
          fontWeight: 'bold',
          fill: '#000000',
          selectable: false,
          evented: false
        });

        const label = new fabric.Textbox(item.label, {
          left: 50,
          top: yOffset,
          fontSize: 12,
          fontWeight: 'bold',
          fill: '#000000',
          selectable: false,
          evented: false
        });

        const description = new fabric.Textbox(item.description, {
          left: 50,
          top: yOffset + 15,
          fontSize: 10,
          fill: '#666666',
          selectable: false,
          evented: false
        });

        canvas.add(symbol);
        canvas.add(label);
        canvas.add(description);
        yOffset += 35;
      });
    };

    const handleExport = () => {
      if (fabricCanvasRef.current) {
        const dataURL = fabricCanvasRef.current.toDataURL({
          format: 'png',
          quality: 1
        });
        onExport(dataURL, 'blueprint-2d.png');
      }
    };

    if (!blueprint) {
      return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">2D Blueprint</h3>
              <p className="text-gray-600">Interactive floor plan with furniture</p>
            </div>
          </div>
          <div className="flex items-center justify-center h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Generate a blueprint to see the 2D view</p>
              <p className="text-gray-400 text-sm mt-1">Interactive floor plan with furniture placement</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">2D Blueprint</h3>
              <p className="text-gray-600">Interactive floor plan with furniture</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFurniture(!showFurniture)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${showFurniture
                ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                : 'bg-gray-100 text-gray-600 border-2 border-gray-200'
                }`}
            >
              {showFurniture ? '🪑 Hide Furniture' : '🪑 Show Furniture'}
            </button>
            <button
              onClick={handleExport}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              📥 Export PNG
            </button>
          </div>
        </div>
        <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
          <canvas ref={canvasRef} />
        </div>
        <div className="mt-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          <p className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Interactive blueprint with {blueprint.rooms.length} rooms, furniture placement, and detailed measurements</span>
          </p>
        </div>
      </div>
    );
  };

  export default Blueprint2D;