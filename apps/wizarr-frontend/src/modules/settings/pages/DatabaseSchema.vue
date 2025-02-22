<template>
    <VueFlow v-model="elements" fit-view-on-init :node-drag-handle="'.drag-handle'" @pane-ready="onPaneReady" :edges-updatable="false" :default-edge-options="{ type: 'custom' }" style="z-index: -1; position: absolute !important; top: 0px; left: 0px; right: 0px; bottom: 0px">
        <template #node-table="{ data }">
            <div class="table-node">
                <div class="drag-handle">
                    <strong>{{ data.label }}</strong>
                </div>
                <div class="columns">
                    <div v-for="col in data.columns" :key="col.column_name" class="column">
                        <span class="column-name">{{ col.column_name }}</span>
                        <span class="column-type">{{ col.data_type }}</span>
                    </div>
                </div>
            </div>
        </template>

        <template #edge-custom="{ sourceX, sourceY, targetX, targetY, data }">
            <path class="vue-flow__edge-path" :d="`M ${sourceX},${sourceY} V ${sourceY + 40 + data.offsetY} H ${targetX} V ${targetY}`" style="stroke: #475569; stroke-width: 2" marker-end="url(#arrow)" />
            <foreignObject :x="Math.min(sourceX, targetX) + Math.abs(targetX - sourceX) / 2 - 50" :y="sourceY + 40 + data.offsetY - 15" width="100" height="30" style="pointer-events: none">
                <div class="edge-label">
                    {{ data.label }}
                </div>
            </foreignObject>
        </template>

        <Controls />
        <MiniMap />
        <Background :gap="12" :size="1" />

        <defs>
            <marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
                <path d="M0,0 L0,12 L12,6 z" fill="#475569" />
            </marker>
        </defs>
    </VueFlow>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { MiniMap } from "@vue-flow/minimap";
import { Controls } from "@vue-flow/controls";
import { useAxios } from "@/plugins/axios";
import dagre from "dagre";

interface Column {
    column_name: string;
    data_type: string;
}

interface Relationship {
    source_table: string;
    source_column: string;
    target_table: string;
    target_column: string;
}

interface TableSchema {
    table_name: string;
    columns: Column[];
    relationships: Relationship[];
}

interface FlowEdge {
    id: string;
    source: string;
    target: string;
    type: string;
    label: string;
    style: { stroke: string };
    data: {
        label: string;
        offsetY: number;
    };
}

interface FlowNode {
    id: string;
    position: { x: number; y: number };
    data: {
        label: string;
        columns: Column[];
        relationships: Relationship[];
    };
    type: string;
    style: {
        width: string;
        background: string;
        borderRadius: string;
        boxShadow: string;
        zIndex: number;
    };
}

const axios = useAxios();
const { fitView } = useVueFlow();
const elements = ref<(FlowNode | FlowEdge)[]>([]);
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const NODE_WIDTH = 260;
const NODE_HEIGHT_BASE = 50;
const COLUMN_HEIGHT = 28;
const EDGE_OFFSET_STEP = 50;
const EDGE_PATH_OFFSET = 40;

function calculateNodeHeight(columns: Column[]): number {
    return NODE_HEIGHT_BASE + columns.length * COLUMN_HEIGHT;
}

async function fetchSchema() {
    try {
        const response = await axios.get<TableSchema[]>("/api/database/schema");
        const schema = response.data;

        dagreGraph.setGraph({
            rankdir: "TB",
            align: "UL",
            ranksep: 100,
            nodesep: 50,
        });

        schema.forEach((table) => {
            dagreGraph.setNode(table.table_name, {
                width: NODE_WIDTH,
                height: calculateNodeHeight(table.columns),
            });
        });

        schema.forEach((table) => {
            table.relationships?.forEach((rel) => {
                dagreGraph.setEdge(rel.source_table, rel.target_table);
            });
        });

        dagre.layout(dagreGraph);

        const nodes: FlowNode[] = schema.map((table) => {
            const dagreNode = dagreGraph.node(table.table_name);
            return {
                id: table.table_name,
                position: {
                    x: dagreNode.x - NODE_WIDTH / 2,
                    y: dagreNode.y - calculateNodeHeight(table.columns) / 2,
                },
                data: {
                    label: table.table_name,
                    columns: table.columns,
                    relationships: table.relationships || [],
                },
                type: "table",
                style: {
                    width: `${NODE_WIDTH}px`,
                    background: "#ffffff",
                    borderRadius: "4px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    zIndex: 10,
                },
            };
        });

        const edges: FlowEdge[] = [];
        const edgePathMap = new Map<string, number>();

        schema.forEach((table) => {
            table.relationships?.forEach((rel) => {
                const sourceNode = nodes.find((n) => n.id === rel.source_table);
                const targetNode = nodes.find((n) => n.id === rel.target_table);

                if (!sourceNode || !targetNode) return;

                const sourceX = sourceNode.position.x + NODE_WIDTH / 2;
                const targetX = targetNode.position.x + NODE_WIDTH / 2;
                const minX = Math.min(sourceX, targetX);
                const maxX = Math.max(sourceX, targetX);

                // Create unique key for path segment
                const pathKey = `${minX}-${maxX}-${sourceNode.position.y}`;
                const count = edgePathMap.get(pathKey) || 0;
                const offsetY = count * EDGE_OFFSET_STEP;

                edges.push({
                    id: `edge-${rel.source_table}-${rel.source_column}-${rel.target_table}-${count}`,
                    source: rel.source_table,
                    target: rel.target_table,
                    type: "custom",
                    label: `${rel.source_column} → ${rel.target_column}`,
                    style: { stroke: "#475569" },
                    data: {
                        label: `${rel.source_column} → ${rel.target_column}`,
                        offsetY: offsetY,
                    },
                });

                edgePathMap.set(pathKey, count + 1);
            });
        });

        elements.value = [...nodes, ...edges];
        setTimeout(() => fitView({ padding: 0.1 }), 50);
    } catch (error) {
        console.error("Error fetching schema:", error);
    }
}

function onPaneReady() {
    fitView();
}

onMounted(fetchSchema);
</script>

<style>
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";

.table-node {
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
}

.drag-handle {
    cursor: move;
    padding: 8px;
    background: #f0f0f0;
    border-bottom: 1px solid #e2e8f0;
}

.columns {
    padding: 8px;
    background: white;
}

.column {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
    font-size: 0.9em;
}

.column-name {
    color: #334155;
}

.column-type {
    color: #64748b;
    font-style: italic;
}

.vue-flow__edge-path {
    stroke-dasharray: 0;
}

.vue-flow__edges {
    z-index: 1 !important;
}

.vue-flow__nodes {
    z-index: 2 !important;
}

.edge-label {
    background: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.8em;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    text-align: center;
    color: #475569;
    border: 1px solid #e2e8f0;
    pointer-events: none;
}
</style>
