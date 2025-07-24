import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, StatusBar, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useProjectContext } from '../context/ProjectContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Swipeable } from 'react-native-gesture-handler';

export default function ActivityScreen() {
  const { activities, projects, setActivities } = useProjectContext();
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread'>('all');
  const avatarUrl = null;
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // For demo, all activities are 'read'. You can add unread logic if needed.
  const visibleActivities = activities;
  const unreadCount = 0;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleActivityPress = (id: string) => {
    // For demo: show alert or log
    if (typeof window !== 'undefined' && window.alert) {
      window.alert('Viewing activity details (placeholder)');
    } else {
      console.log('Viewing activity details (placeholder)');
    }
  };

  return (
    <LinearGradient colors={["#F6F2F7", "#E9D7F7", "#A07BB7"]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Clean top area, no header/profile/tabs */}
          <View style={styles.divider} />

          {/* Activity List */}
          {visibleActivities.length > 0 ? (
            <View style={{ paddingHorizontal: 10, paddingTop: 12 }}>
              {visibleActivities.map(activity => {
                const project = projects.find(p => p.id === activity.projectId);
                return (
                  <Swipeable
                    key={activity.id}
                    renderRightActions={() => (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => {
                          setActivities(prev => prev.filter(a => a.id !== activity.id));
                        }}
                      >
                        <Ionicons name="trash" size={22} color="#fff" />
                      </TouchableOpacity>
                    )}
                  >
                    <TouchableOpacity
                      style={styles.activityCard}
                      onPress={() => handleActivityPress(activity.id)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.activityIconWrap}>
                        <Ionicons name="chatbubble-ellipses-outline" size={22} color="#A07BB7" />
                      </View>
                      <View style={{ flex: 1 }}>
                        {activity.type === 'comment' ? (
                          <>
                            <Text style={styles.activityProject}>
                              {activity.author || 'Someone'} commented on <Text style={styles.activityProjectName}>{project?.title || 'a project'}</Text>:
                            </Text>
                            <Text style={styles.activityComment}>
                              “{activity.text}”
                            </Text>
                            <Text style={styles.activityDateRight}>{activity.date}{activity.time ? ` ${activity.time}` : ''}</Text>
                          </>
                        ) : (
                          <Text style={styles.activityProject}>{activity.text}</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  </Swipeable>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>You're all caught up</Text>
              <Text style={styles.emptySubtitle}>Check back later for new updates.</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  avatarButton: {
    padding: 0,
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    resizeMode: 'cover',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 20,
  },
  tabText: {
    fontSize: 16,
    color: '#999',
  },
  activeTab: {
    color: '#000',
    fontWeight: '600',
  },
  unreadTab: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    marginLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
  },
  gradient: {
    flex: 1,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#A07BB7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e9d7f7',
  },
  activityIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f6f2f7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#e9d7f7',
  },
  activityProject: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginBottom: 2,
  },
  activityProjectName: {
    color: '#A07BB7',
    fontWeight: '700',
  },
  activityComment: {
    fontSize: 15,
    color: '#6C47A6',
    marginBottom: 2,
    fontWeight: '500',
  },
  activityDate: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  activityDateRight: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
    textAlign: 'right',
    alignSelf: 'flex-end',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: '90%',
    borderRadius: 10,
    marginVertical: 4,
    marginRight: 8,
  },
});
