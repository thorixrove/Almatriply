import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useColorScheme } from "nativewind"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const LAST_UPDATED = "22 Agustus 2026"

export default function TermsOfServiceScreen() {
  const router = useRouter()
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === "dark"

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-2 pb-4 gap-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={isDark ? "#F9FAFB" : "#111827"}
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Terms of Service
        </Text>
      </View>

      <ScrollView
        className="px-5"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-xs text-gray-400 dark:text-gray-500 mb-6">
          Terakhir diperbarui: {LAST_UPDATED}
        </Text>

        <Section title="1. Penerimaan Ketentuan">
          Dengan menggunakan aplikasi ini, kamu setuju untuk terikat pada ketentuan layanan berikut. Jika kamu tidak setuju, mohon untuk tidak menggunakan aplikasi ini.
        </Section>

        <Section title="2. Penggunaan Akun">
          Kamu bertanggung jawab menjaga kerahasiaan akunmu. Segala aktivitas yang terjadi melalui akunmu menjadi tanggung jawabmu sepenuhnya.
        </Section>

        <Section title="3. Konten Listing Properti">
          Kamu bertanggung jawab atas akurasi informasi properti yang kamu unggah, termasuk harga, deskripsi, lokasi, dan foto. Dilarang mengunggah:
          {"\n\n"}• Konten palsu, menyesatkan, atau menipu
          {"\n"}• Foto yang melanggar hak cipta pihak lain
          {"\n"}• Listing untuk properti yang bukan milik atau bukan wewenangmu untuk dipasarkan
        </Section>

        <Section title="4. Batasan Tanggung Jawab">
          Aplikasi ini berfungsi sebagai platform penghubung. Kami tidak menjamin keakuratan listing yang diunggah pengguna dan tidak bertanggung jawab atas transaksi yang terjadi di luar aplikasi antar pengguna.
        </Section>

        <Section title="5. Penghentian Akun">
          Kami berhak menangguhkan atau menghapus akun yang melanggar ketentuan ini, termasuk namun tidak terbatas pada penyalahgunaan, konten palsu, atau aktivitas mencurigakan.
        </Section>

        <Section title="6. Perubahan Layanan">
          Kami dapat mengubah, menghentikan sementara, atau menghentikan sebagian maupun seluruh fitur aplikasi kapan pun tanpa pemberitahuan sebelumnya.
        </Section>

        <Section title="7. Hukum yang Berlaku">
          Ketentuan ini diatur dan ditafsirkan sesuai hukum yang berlaku di Republik Indonesia.
        </Section>

        <Section title="8. Kontak">
          Pertanyaan seputar ketentuan layanan dapat dikirim ke:
          {"\n\n"}thorixrover@gmail.com
        </Section>
      </ScrollView>
    </SafeAreaView>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-6">
      <Text className="text-base font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </Text>
      <Text className="text-sm text-gray-600 dark:text-gray-300 leading-6">
        {children}
      </Text>
    </View>
  )
}