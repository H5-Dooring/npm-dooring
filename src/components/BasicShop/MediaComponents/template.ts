import Video from './Video/template';
import Audio from './Audio/template';
import Calendar from './Calendar/template';
import Map from './Map/template';

const mediaTemplate = [Video, Audio, Calendar, Map];

const MediaTemplate = mediaTemplate.map(v => {
  return { ...v, category: 'media' };
});

export default MediaTemplate;
