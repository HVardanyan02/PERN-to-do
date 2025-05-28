import Button from '../components/Button';
import logo from '../to-do.webp';
function Welcome() {
  return (
    <div className="Welcome">
      <img src={logo} className="App-logo" alt="logo" />
      <>
        <h3>Welcome to</h3>
        <h2>OUR REMINDER</h2>
      </>
      <div className='to-do-cl' style={{textAlign: 'center', margin: 'auto', padding: '5px', width: '350px', color: '#0b0b0b'}}>
      <p>Stay organized and never forget a task again! Our Reminder helps you manage your daily to-dos effortlessly.  
        Set tasks, track progress, and stay productive with ease.</p>  
      </div>
      <Button url="/login">Get Start</Button>
    </div>
  );
}

export default Welcome;