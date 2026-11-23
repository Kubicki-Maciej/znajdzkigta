
import React, { useState, useEffect } from "react";
import points from "../data/points.json";
import "./Map.css";

export default function Map() {
    // Wczytywanie odwiedzonych punktów z localStorage
    const [visited, setVisited] = useState(() => {
        try {
            const saved = localStorage.getItem("visitedPoints");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [selectedPoint, setSelectedPoint] = useState(null);

    // Zapisywanie odwiedzonych punktów
    useEffect(() => {
        localStorage.setItem(
            "visitedPoints",
            JSON.stringify(visited)
        );
    }, [visited]);

    // Oznaczanie punktu jako odwiedzonego
    const toggleVisited = (name) => {
        setVisited(prev =>
            prev.includes(name)
                ? prev.filter(item => item !== name)
                : [...prev, name]
        );
    };

    return (
        <div className="map-container">

            <div className="map-content">

                {/* Obraz mapy */}
                <img
                    src="`${process.env.PUBLIC_URL}/map.png"
                    className="map-image"
                    alt="Mapa"
                />

                {/* Punkty na mapie */}
                {points.map((point, index) => {
                    const isVisited = visited.includes(point.name);

                    return (
                        <button
                            key={`${point.name}-${index}`}
                            className={`map-point ${
                                isVisited ? "visited" : ""
                            }`}
                            style={{
                                left: `${point.x / 2048 * 100}%`,
                                top: `${point.y / 2048 * 100}%`
                            }}
                            onClick={() => setSelectedPoint(point)}
                            title={point.name}
                        />
                    );
                })}

            </div>

            {/* Statystyki */}
            <div className="map-stats">
                <span>
                    Odwiedzone: {visited.length} / {points.length}
                </span>

                <span>
                    {points.length > 0
                        ? Math.round(visited.filter(name =>
                            points.some(point => point.name === name)
                        ).length / points.length * 100)
                        : 0}%
                </span>
            </div>

            {/* MODAL */}
            {selectedPoint && (
                <div
                    className="modal-overlay"
                    onClick={() => setSelectedPoint(null)}
                >
                    <div
                        className="modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Zamknięcie */}
                        <button
                            className="modal-close"
                            onClick={() => setSelectedPoint(null)}
                        >
                            ×
                        </button>

                        {/* Nazwa */}
                        <h2>{selectedPoint.name}</h2>

                        {/* Zdjęcie */}
                        <img
                            src={`${process.env.PUBLIC_URL}/images/${selectedPoint.name}`}
                            alt={selectedPoint.name}
                            className="modal-image"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />

                        {/* Informacje */}
                        <div className="modal-info">
                            <p>
                                <strong>X:</strong> {selectedPoint.x}
                            </p>

                            <p>
                                <strong>Y:</strong> {selectedPoint.y}
                            </p>

                            <p>
                                <strong>Kąt:</strong> {selectedPoint.angle}°
                            </p>

                            <p>
                                <strong>Scale:</strong> {selectedPoint.scale}
                            </p>

                            <p>
                                <strong>Score:</strong> {
                                    selectedPoint.score?.toFixed(4)
                                }
                            </p>
                        </div>

                        {/* Odwiedzone */}
                        <button
                            className={`visit-button ${
                                visited.includes(selectedPoint.name)
                                    ? "already-visited"
                                    : ""
                            }`}
                            onClick={() =>
                                toggleVisited(selectedPoint.name)
                            }
                        >
                            {visited.includes(selectedPoint.name)
                                ? "✓ Odwiedzone (cofnij)"
                                : "Oznacz jako odwiedzone"}
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
}
