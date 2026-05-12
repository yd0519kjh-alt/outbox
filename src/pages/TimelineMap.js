import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './TimelineMap.css';

// [아이콘 설정] 숫자를 직접 입력하여 쉼표/수치 에러를 방지했습니다.
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: L.point(25, 41),
  iconAnchor: L.point(12, 41),
  popupAnchor: L.point(1, -34)
});

L.Marker.prototype.options.icon = DefaultIcon;

// [데이터] 1번부터 10번까지 모든 장소와 사진 경로를 포함했습니다.
const HISTORICAL_SITES = [
  { 
    id: 1, 
    name: "천안 아우내 장터", 
    position: [36.8118, 127.2995], 
    date: "1919-04-01", 
    location: "충남 천안시 병천면", 
    desc: "유관순 열사가 아우내 장터에서 만세 운동을 주도한 곳입니다.", 
    image: "/assets/images/sites/site_01.jpg" 
  },
  { 
    id: 2, 
    name: "서대문 형무소", 
    position: [37.5744, 126.9562], 
    date: "1908-1987", 
    location: "서울시 서대문구", 
    desc: "수많은 독립운동가들이 투옥되어 고초를 겪은 역사의 현장입니다.", 
    image: "/assets/images/sites/site_02.jpg" 
  },
  { 
    id: 3, 
    name: "탑골 공원", 
    position: [37.5712, 126.9883], 
    date: "1919-03-01", 
    location: "서울시 종로구", 
    desc: "3·1 운동의 발상지로 독립 선언서가 처음 낭독된 곳입니다.", 
    image: "/assets/images/sites/site_03.jpg" 
  },
  { 
    id: 4, 
    name: "독립기념관", 
    position: [36.7836, 127.2231], 
    location: "충남 천안시 목천읍", 
    desc: "대한민국 독립의 역사를 보존하고 기리는 대표적인 공간입니다.", 
    image: "/assets/images/sites/site_04.jpg" 
  },
  { 
    id: 5, 
    name: "안중근 의사 기념관", 
    position: [37.5555, 126.9770], 
    location: "서울시 남산공원", 
    desc: "안중근 의사의 생애와 독립 정신을 기리는 기념관입니다.", 
    image: "/assets/images/sites/site_05.jpg" 
  },
  { 
    id: 6, 
    name: "매헌 윤봉길 기념관", 
    position: [37.4682, 127.0360], 
    location: "서울시 양재 시민의숲", 
    desc: "상하이 의거의 주인공 윤봉길 의사를 기리는 곳입니다.", 
    image: "/assets/images/sites/site_06.jpg" 
  },
  { 
    id: 7, 
    name: "유관순 열사 생가", 
    position: [36.8115, 127.3023], 
    location: "충남 천안시 병천면", 
    desc: "유관순 열사가 태어나고 자라며 독립의 꿈을 키운 곳입니다.", 
    image: "/assets/images/sites/site_07.jpg" 
  },
  { 
    id: 8, 
    name: "제암리 3·1운동 유적지", 
    position: [37.1265, 126.9026], 
    location: "경기 화성시 향남읍", 
    desc: "일제의 무자비한 보복 학살이 있었던 가슴 아픈 현장입니다.", 
    image: "/assets/images/sites/site_08.jpg" 
  },
  { 
    id: 9, 
    name: "대구 3·1운동 계단", 
    position: [35.8655, 128.5878], 
    location: "대구 중구 동산동", 
    desc: "만세 운동 당시 학생들이 감시를 피해 이동했던 비밀 통로입니다.", 
    image: "/assets/images/sites/site_09.jpg" 
  },
  { 
    id: 10, 
    name: "대한민국 임시정부 기념관", 
    position: [37.5755, 126.9612], 
    location: "서울시 서대문구", 
    desc: "임시정부의 수립부터 환국까지의 역사를 담은 최신 기념관입니다.", 
    image: "/assets/images/sites/site_10.jpg" 
  }
];

function TimelineMap({ onBack }) {
  const [selectedSite, setSelectedSite] = useState(null);

  return (
    <div className="map-container animate-fade">
      <header className="map-header">
        <button className="back-btn" onClick={onBack}>← 메인으로</button>
        <div className="header-text">
          <h2>독립운동 사적지 지도</h2>
        </div>
      </header>

      <div className="map-body" style={{ position: 'relative' }}>
        <MapContainer center={[36.5, 127.8]} zoom={7} style={{ height: "100%", width: "100%" }}>
          <TileLayer 
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          />

          {HISTORICAL_SITES.map((site) => (
            <Marker 
              key={site.id} 
              position={site.position}
              eventHandlers={{
                click: () => setSelectedSite(site),
              }}
            >
              <Popup><strong>{site.name}</strong></Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* 상세 설명 카드 (클릭 시 하단에서 튀어나옴) */}
        {selectedSite && (
          <div className="info-panel-overlay">
            <div className="info-panel animate-slide-up">
              <button className="close-panel" onClick={() => setSelectedSite(null)}>×</button>
              
              <div className="info-content">
                <div className="info-image-container">
                  <img 
                    src={process.env.PUBLIC_URL + selectedSite.image} 
                    alt={selectedSite.name} 
                    className="info-main-image"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/400x200?text=이미지+준비중"; }}
                  />
                </div>

                <div className="info-text">
                  <span className="info-tag">역사적 사적지</span>
                  <h3>{selectedSite.name}</h3>
                  <p className="info-meta">📍 {selectedSite.location}</p>
                  {selectedSite.date && <p className="info-meta">📅 {selectedSite.date}</p>}
                  <hr />
                  <p className="info-description">{selectedSite.desc}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TimelineMap;