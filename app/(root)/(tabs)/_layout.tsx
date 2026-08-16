import { NativeTabs, Label, Icon } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf="house.fill" drawable='custom_android_darwable' />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="search">
        <Icon sf="magnifyingglass"/>
        <Label>Search</Label>
      </NativeTabs.Trigger>

          <NativeTabs.Trigger name="saved">
        <Icon sf="heart.fill"/>
        <Label>Saved</Label>
      </NativeTabs.Trigger>
    
           <NativeTabs.Trigger name="profile">
        <Icon sf="person.fill"/>
        <Label>Profile</Label>
      </NativeTabs.Trigger>

    </NativeTabs>
  );
}
