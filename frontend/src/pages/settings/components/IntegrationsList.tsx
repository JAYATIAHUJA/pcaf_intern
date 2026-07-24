import type { Integration } from '../../../types/settings';
import { IconPlug } from '@tabler/icons-react';
import { SettingsSectionCard } from '../../../components/ui/SettingsSectionCard';

interface IntegrationsListProps {
  integrations: Integration[];
  connectIntegration: (id: number) => void;
}

export function IntegrationsList({ integrations, connectIntegration }: IntegrationsListProps) {
  return (
    <SettingsSectionCard title="Integrations" icon={<IconPlug size={16} />}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {integrations.map(integration => {
          let statusClass = 'badge-neutral';
          if (integration.status === 'Connected') statusClass = 'badge-success';
          else if (integration.status === 'Error') statusClass = 'bg-rose-50 text-rose-700 badge';
          
          return (
            <div 
              key={integration.name} 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between", 
                padding: "12px 16px", 
                borderRadius: 8, 
                border: "1px solid #f1f5f9", 
                background: "#f8fafc" 
              }}
            >
              <div>
                <div className="text-sm font-medium text-slate-800">{integration.name}</div>
                <span className={statusClass} style={{ fontSize: 11, marginTop: 2 }}>{integration.status}</span>
              </div>
              <button 
                onClick={() => integration.status !== 'Connected' && connectIntegration(integration.id)}
                className="btn btn-secondary btn-sm"
              >
                {integration.status === 'Connected' ? 'Configure' : 'Connect'}
              </button>
            </div>
          );
        })}
      </div>
    </SettingsSectionCard>
  );
}
