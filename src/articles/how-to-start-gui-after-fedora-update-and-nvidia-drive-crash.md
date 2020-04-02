---
title: Fedora系统更新之后无法进入图形界面的可能的解决方法
date: 2016-12-18 14:20:07
author: Morris Liu

---

# Fedora系统更新之后无法进入图形界面的可能的解决方法

今天下午跑了一下 `dnf update` 之后，我的 Fedora 就崩了。依稀记得是更新了几个 x 的包，然后就进不去桌面环境了。

后来在网上找了好半天发现可能是 nVidia 驱动的锅，试着重装了一下驱动就满血复活👌

<!-- more -->

## 卸载 nVidia 驱动

重启之后是进不去图形界面的，这时候按 `Ctrl+Alt+F2` 进入终端，执行

``` shell
# nvidia-installer --uninstall
```

把驱动删掉。

## 重装 nVidia 驱动

[参考网址](https://www.if-not-true-then-false.com/2015/fedora-nvidia-guide/)

参考上面这个网址👆

``` shell
$ chmod +x ~/Downloads/NVIDIA-Linux-*.run
$ sudo dnf update
```

如果系统已经是最新了就不用重启了，如果不是最新的话，那么跑完 `dnf update` 之后要重启一下机器

``` shell
$ sudo dnf install kernel-devel kernel-headers gcc dkms acpid
$ su

// Disable nouveau
# echo "blacklist nouveau" >> /etc/modprobe.d/blacklist.conf
# nano /etc/sysconfig/grub

## Add this to /etc/sysconfig/grub ##
GRUB_CMDLINE_LINUX="rd.lvm.lv=fedora/swap rd.lvm.lv=fedora/root rhgb quiet rd.driver.blacklist=nouveau"
## Exit ##

# grub2-mkconfig -o /boot/efi/EFI/fedora/grub.cfg

// Remove xorg-x11-drv-nouveau
# dnf remove xorg-x11-drv-nouveau
```

检查一下 `/etc/dnf/dnf.conf` 这个文件里有没有 `exclude=xorg-x11*` ，如果有就删掉。

``` shell
// Generate initramfs
# mv /boot/initramfs-$(uname -r).img /boot/initramfs-$(uname -r)-nouveau.img
# dracut /boot/initramfs-$(uname -r).img $(uname -r)
```

重启机器进入 Runlevel 3

``` shell
# systemctl set-default multi-user.target
# reboot
```

重启之后，登陆终端，切到驱动安装程序所在的目录

``` shell
# ./NVIDIA-Linux-*.run
```

然后就是一路 Accept/Yes 就可以了。安装完了之后记得切回 Runlevel 5

``` shell
# systemctl set-default graphical.target
# reboot
```

然后驱动就装好了，可以正常进入图形界面啦😊

然后再装个视频加速

``` shell
$ sudo dnf install vdpauinfo libva-vdpau-driver libva-utils
```

大功告成！
