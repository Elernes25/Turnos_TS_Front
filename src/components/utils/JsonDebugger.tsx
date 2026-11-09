import { useWatch } from 'react-hook-form';
import type { Control, FieldValues } from 'react-hook-form';

interface JsonDebuggerProps<T extends FieldValues> {
  control: Control<T>;
  titulo?: string;
}

export const JsonDebugger = <T extends FieldValues>({
  control,
  titulo = 'Estado actual del JSON',
}: JsonDebuggerProps<T>) => {
  const data = useWatch({ control });

  return (
    <div style={{
      marginTop: 20, padding: 15, backgroundColor: '#1e1e1e',
      color: '#4af626', borderRadius: 8, fontFamily: 'monospace', overflowX: 'auto',
    }}>
      <p style={{ margin: '0 0 10px 0', color: '#fff', fontWeight: 'bold' }}>{titulo}</p>
      <pre style={{ margin: 0 }}>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};