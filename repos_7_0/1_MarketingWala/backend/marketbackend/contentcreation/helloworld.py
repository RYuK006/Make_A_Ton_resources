from conductor.client.automator.task_handler import TaskHandler
from conductor.client.configuration.configuration import Configuration
from conductor.client.workflow.conductor_workflow import ConductorWorkflow
from conductor.client.workflow.executor.workflow_executor import WorkflowExecutor
from conductor.client.orkes_clients import OrkesClients
from conductor.client.http.models import StartWorkflowRequest
import os
from greetings_workflow import greetings_workflow
from dotenv import load_dotenv

load_dotenv()




def register_workflow(workflow_executor: WorkflowExecutor) -> ConductorWorkflow:
    workflow = greetings_workflow(workflow_executor=workflow_executor)
    workflow.register(True)
    return workflow


os.environ['CONDUCTOR_SERVER_URL'] = 'https://play.orkes.io/api'
os.environ['CONDUCTOR_AUTH_KEY'] = os.getenv('CONDUCTOR_AUTH_KEY')
os.environ['CONDUCTOR_AUTH_SECRET'] = os.getenv('CONDUCTOR_AUTH_SECRET')

def main():
    # The app is connected to http://localhost:8080/api by default
    api_config = Configuration()

    # clients = OrkesClients(configuration = api_config)
    # workflow_client = clients.get_workflow_client() 
    # request = StartWorkflowRequest()
    # request.name = 'paymets_flowarft1'
    # request.version = 1
    # request.input = {'depositeamout': '123',
    #                  'depositeaccountid': '123',}

    # workflow_run = workflow_client.execute_workflow(
    #     start_workflow_request=request, 
    #     wait_for_seconds=12)
    


    



    workflow_executor = WorkflowExecutor(configuration=api_config)

    # Registering the workflow (Required only when the app is executed the first time)
    workflow = register_workflow(workflow_executor)
    #print(f'workflow {workflow.name} registered successfully arfath  \n')

    # Starting the worker polling mechanism
    task_handler = TaskHandler(configuration=api_config)
    task_handler.start_processes()
    print('worker started successfully  arfath\n')
    workflow_run = workflow_executor.execute(name="anshuman123",version=1)

    

  #   workflow_run = workflow_executor.execute(name="PUSH_NOTIFICATION",version=1, workflow_input={'user_phoneED': 'https://noisy-shape-d32d.upadhayayanshum.workers.dev',
  #  "Title": "the best",
  #  "Body": "i eam just testing"})

    # print(f'\nworkflow result: {workflow_run.output}\n')
    # print(f'see the workflow execution here: {api_config.ui_host}/execution/{workflow_run.workflow_id}\n')
   # task_handler.stop_processes()


if __name__ == '__main__':
    main()