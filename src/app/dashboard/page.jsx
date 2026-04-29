export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p>Welcome back</p>
          <h1>Overview</h1>
        </div>
        <button>Add Task</button>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p>24</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p>18</p>
        </div>
        <div className="stat-card">
          <h3>Projects</h3>
          <p>5</p>
        </div>
        <div className="stat-card">
          <h3>Focus Hours</h3>
          <p>6.5h</p>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-card large">
          <h3>Today’s Tasks</h3>
        </div>
        <div className="dashboard-card">
          <h3>Project Progress</h3>
        </div>
        <div className="dashboard-card">
          <h3>Recent Activity</h3>
        </div>
        <div className="dashboard-card large">
          <h3>Analytics Overview</h3>
        </div>
      </section>
    </div>
  );
}