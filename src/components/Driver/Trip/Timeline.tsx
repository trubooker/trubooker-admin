const Timeline = ({ stops }: any) => (
  <div className="timeline">
    {stops.map((stop: any, index: number) => (
      <div key={index} className="timeline-item">
        <div className="time">{stop.time}</div>
        <div className="description">{stop.name}</div>
      </div>
    ))}
  </div>
);
