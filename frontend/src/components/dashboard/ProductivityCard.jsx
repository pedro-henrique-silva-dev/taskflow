import { PRIORITIES } from '../../utils/constants.js';
import Icon from '../ui/Icon.jsx';

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ProductivityCard({ stats }) {
  const offset = CIRCUMFERENCE * (1 - stats.completionRate / 100);

  return (
    <section className="card productivity">
      <h2 className="card__title">Produtividade</h2>

      <div className="productivity__summary">
        <div
          className="ring"
          role="progressbar"
          aria-valuenow={stats.completionRate}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Taxa de conclusão"
        >
          <svg className="ring__svg" viewBox="0 0 120 120" aria-hidden="true">
            <defs>
              <linearGradient id="ring-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" style={{ stopColor: 'var(--color-primary)' }} />
                <stop offset="100%" style={{ stopColor: 'var(--color-accent)' }} />
              </linearGradient>
            </defs>
            <circle className="ring__track" cx="60" cy="60" r={RADIUS} />
            <circle
              className="ring__value"
              cx="60"
              cy="60"
              r={RADIUS}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
            />
          </svg>
          <span className="ring__label">
            <strong>{stats.completionRate}%</strong>
            <small>concluídas</small>
          </span>
        </div>

        <div className="productivity__highlights">
          <div className="productivity__highlight">
            <span className="productivity__highlight-icon">
              <Icon name="trending" size={16} />
            </span>
            <div>
              <strong>{stats.completedLast7Days}</strong>
              <span>concluídas em 7 dias</span>
            </div>
          </div>
          <div className="productivity__highlight">
            <span className="productivity__highlight-icon productivity__highlight-icon--warning">
              <Icon name="clock" size={16} />
            </span>
            <div>
              <strong>{stats.dueToday}</strong>
              <span>vencem hoje</span>
            </div>
          </div>
        </div>
      </div>

      <dl className="productivity__list">
        {PRIORITIES.map((priority) => (
          <div key={priority.value}>
            <dt>
              <span className={`dot dot--${priority.value}`} aria-hidden="true" />
              Pendentes de prioridade {priority.label.toLowerCase()}
            </dt>
            <dd>{stats.pendingByPriority[priority.value]}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default ProductivityCard;
