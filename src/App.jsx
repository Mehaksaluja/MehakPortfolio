import Contact from './components/Contact';
import Education from './components/Education';
import Experience from './components/Experience';
import Landing from './components/Landing';
import Masthead from './components/Masthead';
import Skills from './components/Skills';
import VoiceAgent from './components/VoiceAgent';
import Work from './components/Work';

const App = () => (
  <>
    <div aria-hidden className="page-field" />

    <div className="relative z-10">
      <Masthead />
      <main>
        <Landing />
        <Experience />
        <Work />
        <Skills />
        <Education />
        <Contact />
      </main>
      <VoiceAgent />
    </div>
  </>
);

export default App;
