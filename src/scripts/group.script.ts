import 'dotenv/config';

import { database } from '../config/database.config';
import { GroupService } from '../modules/group/group.service';
import { User } from '../modules/user/user.entity';
import { Group } from '../modules/group/group.entity';

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
      process.exitCode = 1;
    }
  }

  console.log('\nDONE\n');

  process.exit();
};

database.createConnection([User, Group]).then(() => {
  addGroupsToDB().catch(console.error)
});
