import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Plus } from 'lucide-react';

export const MindmapNode = memo(({ id, data, isConnectable }: NodeProps) => {
  const style = data.style || {
    background: '#fff',
    color: '#1a1b26',
    borderRadius: '12px',
  };

  return (
    <div className="relative group">
      <div
        className="shadow-lg transition-shadow hover:shadow-xl cursor-pointer"
        style={{
          background: style.background || (data.isRoot ? '#1a1b26' : '#ffffff'),
          color: style.color || (data.isRoot ? '#ffffff' : '#1a1b26'),
          borderRadius: style.borderRadius || '12px',
          padding: style.padding || '12px 24px',
          border: style.border || (data.isRoot ? 'none' : '1px solid #e2e8f0'),
          minWidth: data.isRoot ? '300px' : '240px',
          maxWidth: data.isRoot ? '400px' : '320px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      >
        {/* Left plus button */}
        <button 
          className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          data-side="left"
          data-node-id={id}
        >
          <div className="p-1 rounded-full bg-primary hover:bg-primary/90 cursor-pointer left-plus-btn">
            <Plus className="w-4 h-4 text-primary-foreground" />
          </div>
        </button>

        {/* Left handles */}
        <Handle
          id="left"
          type="source"
          position={Position.Left}
          isConnectable={isConnectable}
          className="w-3 h-3 !bg-muted-foreground/30 -left-1.5"
        />
        <Handle
          id="left"
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          className="w-3 h-3 !bg-muted-foreground/30 -left-1.5"
        />

        <input
          defaultValue={data.label}
          className="w-full bg-transparent border-none focus:outline-none text-center"
          style={{ 
            color: 'inherit',
            fontSize: data.isRoot ? '24px' : (data.depth && data.depth > 2 ? '14px' : '16px'),
            fontWeight: data.isRoot ? '600' : (data.depth && data.depth > 2 ? '400' : '500'),
          }}
          onChange={(evt) => {
            data.label = evt.target.value;
          }}
          placeholder="Add topic"
        />

        {/* Right handles */}
        <Handle
          id="right"
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className="w-3 h-3 !bg-muted-foreground/30 -right-1.5"
        />
        <Handle
          id="right"
          type="target"
          position={Position.Right}
          isConnectable={isConnectable}
          className="w-3 h-3 !bg-muted-foreground/30 -right-1.5"
        />

        {/* Right plus button */}
        <button 
          className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          data-side="right"
          data-node-id={id}
        >
          <div className="p-1 rounded-full bg-primary hover:bg-primary/90 cursor-pointer right-plus-btn">
            <Plus className="w-4 h-4 text-primary-foreground" />
          </div>
        </button>
      </div>
    </div>
  );
});
