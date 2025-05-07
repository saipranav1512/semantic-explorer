import React, { useState } from 'react';
import { List, ListItem, ListItemText, Collapse, IconButton } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import rapidwordsData from '../../../data/rapidwords.json'; // Adjust this path as needed

/**
 * CollapsibleList renders a collapsible menu based on rapidwords.json
 * @param {string} headIndex   - The index (e.g., "1.1.1.2") of this node
 * @param {string} activeIndex - The index of the current tree head (for auto-expansion)
 * @param {number} level       - Depth level for indentation
 * @param {function} onNodeClick - Callback when a node label is clicked
 */
const CollapsibleList = ({ headIndex = '', activeIndex = '', level = 1, onNodeClick }) => {
  // Determine branch key: at top level use only first digit, deeper levels use full index
  const nodeIndex = level === 1 ? headIndex.split('.')[0] || '' : headIndex;
  const node = rapidwordsData[nodeIndex] || null;
  const childIndices = node && Array.isArray(node.hyponyms) ? node.hyponyms : [];

  // Hooks must be called unconditionally at the top
  const [open, setOpen] = useState(() => childIndices.length > 0 && activeIndex.startsWith(nodeIndex + '.'));

  const handleToggle = (e) => { e.stopPropagation(); setOpen(prev => !prev); };

  // If there's no corresponding JSON node, render nothing
  if (!node) {
    return null;
  }

  return (
    <List disablePadding>
      <ListItem
        button
        onClick={() => onNodeClick && onNodeClick({ name: node.domain, index: nodeIndex })}
        style={{ paddingLeft: level * 16 }}
      >
        <ListItemText primary={`${nodeIndex}. ${node.domain}`} />
        {childIndices.length > 0 && (   
          <IconButton onClick={handleToggle} size="small">
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </ListItem>

      {childIndices.length > 0 && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List disablePadding>
            {childIndices.map(childIdx => (
              <CollapsibleList
                key={childIdx}
                headIndex={childIdx}
                activeIndex={activeIndex}
                level={level + 1}
                onNodeClick={onNodeClick}
              />
            ))}
          </List>
        </Collapse>
      )}
    </List>
  );
};

export default CollapsibleList;
