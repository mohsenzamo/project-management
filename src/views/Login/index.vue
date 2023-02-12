<template>
    <div class="w-screen h-screen flex items-center justify-center">
        <transition name="scaleRight" appear>
            <Card v-if="formValue" class="text-center w-2/5 p-10">
                <template #header>
                    <Avatar icon="pi pi-user" size="large" />
                </template>
                <template #title>
                    ثبت نام
                </template>
                <template #content>
                    <div class="my-2">
                        <InputText type="text" placeholder="نام کاربری" class="w-3/4" />
                    </div>
                    <div class="my-2">
                        <InputText type="password" placeholder="رمز عبور" class="w-3/4" />
                    </div>
                    <div class="my-2">
                        <InputText type="password" placeholder="تکرار رمز عبور" class="w-3/4" />
                    </div>
                    <div class="my-2 text-right mx-auto w-3/4">
                        <Button label="ثبت نام" :loading="false" />
                    </div>
                </template>
                <template #footer>
                    <p class="mt-4 font-IRANSans text-xs">
                        حساب کاربری دارید!
                        <span class="text-blue-700 cursor-pointer" @click="formValue = !formValue">ورود به حساب</span>
                    </p>
                </template>
            </Card>

        </transition>
        <transition name="scaleLeft" appear>
            <Card v-if="!formValue" class="text-center w-2/5 p-10">
                <template #header>
                    <Avatar icon="pi pi-user" size="large" />
                </template>
                <template #title>
                    ورود
                </template>
                <template #content>
                    <div class="my-2">
                        <InputText v-model="userName" type="text" placeholder="نام کاربری" class="w-3/4" />
                    </div>
                    <div class="my-2">
                        <InputText type="password" placeholder="رمز عبور" class="w-3/4" />
                    </div>
                    <div class="my-2 text-right mx-auto w-3/4">
                        <Button label="ورود" :loading="false" :disabled="!(userName.length > 0)"
                            @click="goPanel(userName)" />
                    </div>
                </template>
                <template #footer>
                    <p class="font-IRANSans text-xs">
                        حساب کاربری ندارید؟
                        <span class="text-blue-700 cursor-pointer" @click="formValue = !formValue">ثبت نام کنید</span>
                    </p>
                </template>
            </Card>
        </transition>
    </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card';
import Avatar from 'primevue/avatar';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';

export default {
    name: 'LoginPage',

    components: {
        Card,
        Avatar,
        InputText,
        Button
    },

    setup() {
        const formValue = ref(false)
        const userName = ref('')
        const router = useRouter()

        function goPanel(userName: string) {
            router.push({
                name: "UserDashboard",
                params: { id: userName },
            });
        }

        return {
            formValue,
            userName,
            goPanel
        }
    },
}
</script>

<style scoped lang="scss">
.scaleLeft-enter-active,
.scaleRight-enter-active {
    transition: all 0.7s ease;
}

.scaleLeft-leave-active,
.scaleRight-leave-active {
    transition: all 0.6s ease;
}

.scaleRight-enter-from,
.scaleRight-leave-to {
    z-index: 5;
    opacity: 0;
    transform: rotateY(-180deg);
    position: absolute;
}

.scaleRight-leave-from {
    opacity: 0;
}

.scaleLeft-enter-from,
.scaleLeft-leave-to {
    z-index: 5;
    opacity: 0;
    transform: rotateY(180deg);
    position: absolute;
}

.scaleLeft-leave-from {
    opacity: 0;
}
</style>

