import React from 'react';
import { Progress, Card, CardBody, CardHeader } from '@nextui-org/react';

const OrderProgressCard = ({ progressData }) => {
  if (!progressData) {
    return (
      <Card className="w-full max-w-md">
        <CardBody className="text-center py-8">
          <p className="text-gray-500">No hay datos de progreso disponibles</p>
        </CardBody>
      </Card>
    );
  }

  const { 
    total_products, 
    completed_products, 
    total_tasks, 
    completed_tasks, 
    in_progress_tasks, 
    pending_tasks 
  } = progressData;

  const productProgress = total_products > 0 ? (completed_products / total_products) * 100 : 0;
  const taskProgress = total_tasks > 0 ? (completed_tasks / total_tasks) * 100 : 0;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-2">
        <h4 className="text-lg font-semibold">Progreso de la Orden</h4>
      </CardHeader>
      <CardBody className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Productos Completados</span>
            <span>{completed_products}/{total_products}</span>
          </div>
          <Progress 
            value={productProgress} 
            color="success"
            className="max-w-md"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Tareas Completadas</span>
            <span>{completed_tasks}/{total_tasks}</span>
          </div>
          <Progress 
            value={taskProgress} 
            color="primary"
            className="max-w-md"
          />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="bg-red-50 p-2 rounded">
            <div className="text-red-600 font-semibold">{pending_tasks}</div>
            <div className="text-red-500">Pendientes</div>
          </div>
          <div className="bg-yellow-50 p-2 rounded">
            <div className="text-yellow-600 font-semibold">{in_progress_tasks}</div>
            <div className="text-yellow-500">En Progreso</div>
          </div>
          <div className="bg-green-50 p-2 rounded">
            <div className="text-green-600 font-semibold">{completed_tasks}</div>
            <div className="text-green-500">Completadas</div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default OrderProgressCard;