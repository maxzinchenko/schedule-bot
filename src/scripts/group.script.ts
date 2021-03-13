import 'dotenv/config';
import { Group, User } from '../models';
import { createDBConnection } from '../database';
import { GroupService } from '../services';

const addGroupsToDB = async () => {
  const groupService = new GroupService();

  // Getting all existing group names at the current moment
  const groupNames = await groupService.getGroupsNamesFromAPI();
  // Removing all group entities
  await groupService.removeAll();

  console.log('\nPREVIOUS DATA HAS SUCCESSFULLY REMOVED\n');

  // Creating group for each received name
  for (let name of groupNames) {
    try {
      await groupService.create(name);
      console.log('\n', name, '\nCREATED\n');
    } catch (error) {
      console.log('\n', name, '\nERROR\n', error, '\n');
    }
  }

  console.log('\nDONE\n');
};

createDBConnection([User, Group]).then(() => {
  addGroupsToDB().catch(console.error)
});
